package com.focusshield

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import com.facebook.react.bridge.Arguments
import java.util.Calendar

object UsageStatsHelper {
  private const val EVENT_LOOKBACK_MS = 15_000L
  private const val FRESH_FOREGROUND_THRESHOLD_MS = 3_000L

  fun getCurrentForegroundPackage(context: Context): String? {
    if (!PermissionUtils.hasUsageAccessPermission(context)) {
      return null
    }

    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val endTime = System.currentTimeMillis()
    val startTime = endTime - EVENT_LOOKBACK_MS
    val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
    val event = UsageEvents.Event()
    var latestPackage: String? = null
    var latestTimestamp = 0L

    while (usageEvents.hasNextEvent()) {
      usageEvents.getNextEvent(event)
      if (
        event.eventType == UsageEvents.Event.ACTIVITY_RESUMED ||
          event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND
      ) {
        latestPackage = event.packageName
        latestTimestamp = event.timeStamp
      }
    }

    if (
      !latestPackage.isNullOrBlank() &&
        latestPackage != context.packageName &&
        endTime - latestTimestamp <= FRESH_FOREGROUND_THRESHOLD_MS
    ) {
      return latestPackage
    }

    val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
    return stats
      .maxByOrNull { it.lastTimeUsed }
      ?.takeIf { endTime - it.lastTimeUsed <= FRESH_FOREGROUND_THRESHOLD_MS }
      ?.packageName
      ?.takeUnless { it == context.packageName }
  }

  fun getTodayScreenTime(context: Context) =
    Arguments.createArray().apply {
      if (!PermissionUtils.hasUsageAccessPermission(context)) {
        return@apply
      }

      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val calendar = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
      }
      val startTime = calendar.timeInMillis
      val endTime = System.currentTimeMillis()
      val packageManager = context.packageManager

      usageStatsManager
        .queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
        .filter { it.totalTimeInForeground > 0 }
        .filter { it.packageName != context.packageName }
        .sortedByDescending { it.totalTimeInForeground }
        .forEach { stat ->
          val label =
            try {
              val appInfo = packageManager.getApplicationInfo(stat.packageName, 0)
              packageManager.getApplicationLabel(appInfo).toString()
            } catch (_: Exception) {
              stat.packageName
            }

          pushMap(
            Arguments.createMap().apply {
              putString("packageName", stat.packageName)
              putString("appName", label)
              putDouble("totalTimeVisibleMs", stat.totalTimeInForeground.toDouble())
              putDouble("lastTimeUsed", stat.lastTimeUsed.toDouble())
            },
          )
        }
    }
}
