package com.focusshield

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar

data class FocusScheduleRule(
  val id: String,
  val startMinutes: Int,
  val endMinutes: Int,
  val enabled: Boolean,
)

data class FocusBlockingConfig(
  val protectionEnabled: Boolean,
  val selectedPackages: Set<String>,
  val schedules: List<FocusScheduleRule>,
)

object FocusShieldPrefs {
  private const val PREFS_NAME = "focusshield_prefs"
  private const val KEY_CONFIG_JSON = "blocking_config_json"

  fun saveConfig(context: Context, configJson: String) {
    context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString(KEY_CONFIG_JSON, configJson)
      .apply()
  }

  fun loadConfig(context: Context): FocusBlockingConfig {
    val rawConfig =
      context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(KEY_CONFIG_JSON, null)
        ?: return FocusBlockingConfig(false, emptySet(), emptyList())

    return try {
      val json = JSONObject(rawConfig)
      val selectedPackages = json.optJSONArray("selectedApps").toStringSet()
      val schedules = json.optJSONArray("schedules").toSchedules()
      FocusBlockingConfig(
        protectionEnabled = json.optBoolean("protectionEnabled", false),
        selectedPackages = selectedPackages,
        schedules = schedules,
      )
    } catch (_: Exception) {
      FocusBlockingConfig(false, emptySet(), emptyList())
    }
  }

  fun shouldBlockPackage(context: Context, packageName: String): Boolean {
    val config = loadConfig(context)
    if (!config.protectionEnabled || !config.selectedPackages.contains(packageName)) {
      return false
    }

    val now = Calendar.getInstance()
    val minutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
    return config.schedules.any { isScheduleActive(it, minutes) }
  }

  private fun JSONArray?.toStringSet(): Set<String> {
    if (this == null) {
      return emptySet()
    }

    val result = mutableSetOf<String>()
    for (index in 0 until length()) {
      val value = optString(index)
      if (value.isNotBlank()) {
        result.add(value)
      }
    }
    return result
  }

  private fun JSONArray?.toSchedules(): List<FocusScheduleRule> {
    if (this == null) {
      return emptyList()
    }

    val result = mutableListOf<FocusScheduleRule>()
    for (index in 0 until length()) {
      val item = optJSONObject(index) ?: continue
      result.add(
        FocusScheduleRule(
          id = item.optString("id", index.toString()),
          startMinutes = item.optInt("startMinutes", 0),
          endMinutes = item.optInt("endMinutes", 0),
          enabled = item.optBoolean("enabled", true),
        ),
      )
    }
    return result
  }

  private fun isScheduleActive(schedule: FocusScheduleRule, nowMinutes: Int): Boolean {
    if (!schedule.enabled) {
      return false
    }
    if (schedule.startMinutes == schedule.endMinutes) {
      return true
    }
    if (schedule.startMinutes < schedule.endMinutes) {
      return nowMinutes in schedule.startMinutes until schedule.endMinutes
    }
    return nowMinutes >= schedule.startMinutes || nowMinutes < schedule.endMinutes
  }
}
