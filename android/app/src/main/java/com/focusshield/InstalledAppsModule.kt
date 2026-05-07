package com.focusshield

import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.ByteArrayOutputStream

class InstalledAppsModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "InstalledAppsModule"

  @ReactMethod
  fun getInstalledApps(promise: Promise) {
    try {
      val packageManager = reactContext.packageManager
      val launcherIntent =
        Intent(Intent.ACTION_MAIN, null).apply {
          addCategory(Intent.CATEGORY_LAUNCHER)
        }

      @Suppress("DEPRECATION")
      val resolveInfos = packageManager.queryIntentActivities(launcherIntent, 0)
      val packages = linkedSetOf<String>()
      val apps =
        resolveInfos
          .filter { packages.add(it.activityInfo.packageName) }
          .filter { it.activityInfo.packageName != reactContext.packageName }
          .map { resolveInfo ->
            val packageName = resolveInfo.activityInfo.packageName
            val label = resolveInfo.loadLabel(packageManager)?.toString().orEmpty()
            val flags = resolveInfo.activityInfo.applicationInfo.flags
            Arguments.createMap().apply {
              putString("appName", label)
              putString("packageName", packageName)
              putString("iconBase64", drawableToBase64(resolveInfo.loadIcon(packageManager)))
              putBoolean("isSystemApp", flags and ApplicationInfo.FLAG_SYSTEM != 0)
            }
          }
          .sortedBy { it.getString("appName")?.lowercase() ?: "" }

      val result = Arguments.createArray()
      apps.forEach(result::pushMap)
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("INSTALLED_APPS_ERROR", "Unable to fetch installed apps", error)
    }
  }

  private fun drawableToBase64(drawable: Drawable): String {
    val bitmap =
      when (drawable) {
        is BitmapDrawable -> Bitmap.createScaledBitmap(drawable.bitmap, 96, 96, true)
        else -> {
          val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
          val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96
          val safeWidth = width.coerceAtMost(96)
          val safeHeight = height.coerceAtMost(96)
          Bitmap.createBitmap(safeWidth, safeHeight, Bitmap.Config.ARGB_8888).also { bitmap ->
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, canvas.width, canvas.height)
            drawable.draw(canvas)
          }
        }
      }

    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
    return Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
  }
}
