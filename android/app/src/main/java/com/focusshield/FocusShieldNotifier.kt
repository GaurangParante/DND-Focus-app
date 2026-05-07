package com.focusshield

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

object FocusShieldNotifier {
  const val CHANNEL_ID = "focusshield-monitoring"
  const val NOTIFICATION_ID = 1001

  fun ensureChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channel =
      NotificationChannel(
        CHANNEL_ID,
        context.getString(R.string.service_channel_name),
        NotificationManager.IMPORTANCE_LOW,
      ).apply {
        description = context.getString(R.string.service_channel_description)
      }
    manager.createNotificationChannel(channel)
  }

  fun buildNotification(context: Context): Notification {
    val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
      ?.apply { addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP) }
    val pendingIntent =
      launchIntent?.let {
        PendingIntent.getActivity(
          context,
          0,
          it,
          PendingIntent.FLAG_UPDATE_CURRENT or
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0,
        )
      }

    return NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(R.mipmap.ic_launcher)
      .setContentTitle(context.getString(R.string.service_notification_title))
      .setContentText(context.getString(R.string.service_notification_body))
      .setOngoing(true)
      .setSilent(true)
      .setContentIntent(pendingIntent)
      .build()
  }
}
