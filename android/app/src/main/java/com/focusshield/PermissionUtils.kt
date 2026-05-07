package com.focusshield

import android.app.AppOpsManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.os.PowerManager
import android.provider.Settings

object PermissionUtils {
  fun hasUsageAccessPermission(context: Context): Boolean {
    val appOpsManager = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode =
      appOpsManager.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        android.os.Process.myUid(),
        context.packageName,
      )
    return mode == AppOpsManager.MODE_ALLOWED
  }

  fun isAccessibilityServiceEnabled(
    context: Context,
    serviceClass: Class<*>,
  ): Boolean {
    val expectedComponent = ComponentName(context, serviceClass)
    val enabledServices =
      Settings.Secure.getString(
        context.contentResolver,
        Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
      ) ?: return false

    return enabledServices
      .split(':')
      .mapNotNull(ComponentName::unflattenFromString)
      .any { it == expectedComponent }
  }

  fun canDrawOverlays(context: Context): Boolean =
    Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)

  fun isIgnoringBatteryOptimizations(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }
    val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    return powerManager.isIgnoringBatteryOptimizations(context.packageName)
  }
}
