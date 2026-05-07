package com.focusshield

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BlockActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_block)

    val blockedPackage = intent.getStringExtra(EXTRA_PACKAGE_NAME).orEmpty()
    findViewById<TextView>(R.id.blockedPackageText).text = blockedPackage

    findViewById<Button>(R.id.homeButton).setOnClickListener {
      startActivity(
        Intent(Intent.ACTION_MAIN).apply {
          addCategory(Intent.CATEGORY_HOME)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        },
      )
      finish()
    }

    findViewById<Button>(R.id.openAppButton).setOnClickListener {
      packageManager.getLaunchIntentForPackage(packageName)?.let { launchIntent ->
        startActivity(launchIntent)
      }
      finish()
    }
  }

  override fun onBackPressed() {
    moveTaskToBack(true)
  }

  companion object {
    const val EXTRA_PACKAGE_NAME = "extra_package_name"
  }
}
