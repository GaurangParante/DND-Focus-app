package com.focusshield

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val action = intent?.action ?: return
    if (
      action == Intent.ACTION_BOOT_COMPLETED ||
        action == Intent.ACTION_MY_PACKAGE_REPLACED
    ) {
      val config = FocusShieldPrefs.loadConfig(context)
      if (config.protectionEnabled) {
        ContextCompat.startForegroundService(
          context,
          Intent(context, FocusShieldForegroundService::class.java).apply {
            this.action = FocusShieldForegroundService.ACTION_START
          },
        )
      }
    }
  }
}
