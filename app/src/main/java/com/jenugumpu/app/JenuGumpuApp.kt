package com.jenugumpu.app

import android.app.Application
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions

class JenuGumpuApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        val options = FirebaseOptions.Builder()
            .setProjectId("gen-lang-client-0181076621")
            .setApplicationId("1:847367223751:android:native_app") // Modified for Android
            .setApiKey("AIzaSyCj8PxlEOQ_X9UuJer1UfDuiR0CW8CH8XQ")
            .setStorageBucket("gen-lang-client-0181076621.firebasestorage.app")
            .build()

        FirebaseApp.initializeApp(this, options)
    }
}
