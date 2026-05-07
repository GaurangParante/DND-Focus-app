package com.focusshield

import android.app.Service
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper

class FocusShieldForegroundService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private val monitorTask =
    object : Runnable {
      override fun run() {
        val config = FocusShieldPrefs.loadConfig(this@FocusShieldForegroundService)
        if (!config.protectionEnabled) {
          stopSelf()
          return
        }

        UsageStatsHelper.getCurrentForegroundPackage(this@FocusShieldForegroundService)?.let { packageName ->
          BlockEnforcer.enforce(this@FocusShieldForegroundService, packageName)
        }
        handler.postDelayed(this, 1500)
      }
    }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP) {
      handler.removeCallbacks(monitorTask)
      stopForeground(STOP_FOREGROUND_REMOVE)
      stopSelf()
      return START_NOT_STICKY
    }

    FocusShieldNotifier.ensureChannel(this)
    startForeground(FocusShieldNotifier.NOTIFICATION_ID, FocusShieldNotifier.buildNotification(this))
    handler.removeCallbacks(monitorTask)
    handler.post(monitorTask)
    return START_STICKY
  }

  override fun onDestroy() {
    handler.removeCallbacks(monitorTask)
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  companion object {
    const val ACTION_START = "com.focusshield.action.START_PROTECTION"
    const val ACTION_STOP = "com.focusshield.action.STOP_PROTECTION"
  }
}
