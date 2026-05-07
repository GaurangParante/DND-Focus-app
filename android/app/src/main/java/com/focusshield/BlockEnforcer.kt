package com.focusshield

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.os.SystemClock

object BlockEnforcer {
  private var lastBlockedPackage: String? = null
  private var lastBlockedAt = 0L

  fun enforce(context: Context, packageName: String, accessibilityService: AccessibilityService? = null) {
    if (packageName == context.packageName || packageName.startsWith("${context.packageName}:")) {
      return
    }

    if (!FocusShieldPrefs.shouldBlockPackage(context, packageName)) {
      return
    }

    val now = SystemClock.elapsedRealtime()
    if (packageName == lastBlockedPackage && now - lastBlockedAt < 1200) {
      return
    }

    lastBlockedPackage = packageName
    lastBlockedAt = now

    context.startActivity(
      Intent(context, BlockActivity::class.java).apply {
        addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TOP or
            Intent.FLAG_ACTIVITY_SINGLE_TOP or
            Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS,
        )
        putExtra(BlockActivity.EXTRA_PACKAGE_NAME, packageName)
      },
    )
  }
}
