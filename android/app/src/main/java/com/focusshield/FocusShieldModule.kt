package com.focusshield

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FocusShieldModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "FocusShieldModule"

  @ReactMethod
  fun getPermissionStatus(promise: Promise) {
    try {
      val map = Arguments.createMap().apply {
        putBoolean("usageAccess", PermissionUtils.hasUsageAccessPermission(reactContext))
        putBoolean(
          "accessibility",
          PermissionUtils.isAccessibilityServiceEnabled(reactContext, FocusAccessibilityService::class.java),
        )
        putBoolean("overlay", PermissionUtils.canDrawOverlays(reactContext))
        putBoolean(
          "ignoringBatteryOptimizations",
          PermissionUtils.isIgnoringBatteryOptimizations(reactContext),
        )
      }
      promise.resolve(map)
    } catch (error: Exception) {
      promise.reject("PERMISSION_STATUS_ERROR", "Unable to inspect permission state", error)
    }
  }

  @ReactMethod
  fun getTodayScreenTime(promise: Promise) {
    try {
      promise.resolve(UsageStatsHelper.getTodayScreenTime(reactContext))
    } catch (error: Exception) {
      promise.reject("SCREEN_TIME_ERROR", "Unable to load app screen time", error)
    }
  }

  @ReactMethod
  fun openUsageAccessSettings(promise: Promise) {
    launchFirstAvailableIntent(
      listOf(
        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS),
        Intent(Settings.ACTION_SECURITY_SETTINGS),
        buildAppDetailsIntent(),
      ),
      promise,
    )
  }

  @ReactMethod
  fun openAccessibilitySettings(promise: Promise) {
    launchFirstAvailableIntent(
      listOf(
        Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS),
        Intent(Settings.ACTION_SETTINGS),
        buildAppDetailsIntent(),
      ),
      promise,
    )
  }

  @ReactMethod
  fun openOverlaySettings(promise: Promise) {
    val intent =
      Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${reactContext.packageName}"),
      )
    launchFirstAvailableIntent(listOf(intent, buildAppDetailsIntent()), promise)
  }

  @ReactMethod
  fun openBatteryOptimizationSettings(promise: Promise) {
    val action =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS
      } else {
        Settings.ACTION_SETTINGS
      }
    launchFirstAvailableIntent(listOf(Intent(action), buildAppDetailsIntent()), promise)
  }

  @ReactMethod
  fun syncBlockingConfig(configJson: String, promise: Promise) {
    FocusShieldPrefs.saveConfig(reactContext, configJson)
    promise.resolve(null)
  }

  @ReactMethod
  fun startProtection(promise: Promise) {
    val intent = Intent(reactContext, FocusShieldForegroundService::class.java).apply {
      action = FocusShieldForegroundService.ACTION_START
    }
    ContextCompat.startForegroundService(reactContext, intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun stopProtection(promise: Promise) {
    val intent = Intent(reactContext, FocusShieldForegroundService::class.java).apply {
      action = FocusShieldForegroundService.ACTION_STOP
    }
    reactContext.startService(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun getCurrentForegroundApp(promise: Promise) {
    promise.resolve(UsageStatsHelper.getCurrentForegroundPackage(reactContext))
  }

  private fun launchFirstAvailableIntent(intents: List<Intent>, promise: Promise) {
    try {
      val packageManager = reactContext.packageManager
      val launchIntent =
        intents.firstOrNull { intent ->
          intent.resolveActivity(packageManager) != null
        }
          ?: throw IllegalStateException("No matching Android settings screen was available.")

      launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(launchIntent)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("SETTINGS_INTENT_ERROR", "Unable to open Android settings", error)
    }
  }

  private fun buildAppDetailsIntent(): Intent =
    Intent(
      Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
      Uri.parse("package:${reactContext.packageName}"),
    )
}
