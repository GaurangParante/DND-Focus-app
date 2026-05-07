package com.focusshield

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import androidx.core.content.ContextCompat

class FocusAccessibilityService : AccessibilityService() {
  override fun onServiceConnected() {
    super.onServiceConnected()
    val config = FocusShieldPrefs.loadConfig(this)
    if (config.protectionEnabled) {
      ContextCompat.startForegroundService(
        this,
        android.content.Intent(this, FocusShieldForegroundService::class.java).apply {
          action = FocusShieldForegroundService.ACTION_START
        },
      )
    }
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    val packageName = event?.packageName?.toString() ?: return
    if (
      event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED ||
        event.eventType == AccessibilityEvent.TYPE_WINDOWS_CHANGED
    ) {
      BlockEnforcer.enforce(this, packageName, this)
    }
  }

  override fun onInterrupt() = Unit
}
