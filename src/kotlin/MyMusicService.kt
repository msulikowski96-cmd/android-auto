package com.example.carapp

import android.support.v4.media.session.MediaSessionCompat
import androidx.media.MediaBrowserServiceCompat

class MyMusicService : MediaBrowserServiceCompat() {
    private lateinit var mediaSession: MediaSessionCompat

    override fun onCreate() {
        super.onCreate()
        mediaSession = MediaSessionCompat(this, "MyMusicService")
        
        mediaSession.setCallback(object : MediaSessionCompat.Callback() {
            override fun onPlay() { /* Start */ }
            override fun onPause() { /* Pause */ }
            override fun onSkipToNext() { /* Next */ }
        })

        sessionToken = mediaSession.sessionToken
    }

    override fun onGetRoot(clientPackageName: String, clientUid: Int, rootHints: android.os.Bundle?): BrowserRoot? {
        return BrowserRoot("root", null)
    }

    override fun onLoadChildren(parentId: String, result: Result<MutableList<android.support.v4.media.MediaBrowserCompat.MediaItem>>) {
        result.sendResult(mutableListOf())
    }
}
