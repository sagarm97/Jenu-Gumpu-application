package com.jenugumpu.app.data

import com.google.firebase.Timestamp

data class UserProfile(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "hunter",
    val location: String? = null,
    val photoURL: String? = null,
    val totalHarvested: Double = 0.0,
    val createdAt: String = ""
)

data class Harvest(
    val id: String = "",
    val hunterId: String = "",
    val hunterName: String = "",
    val quantity: Double = 0.0,
    val floralSource: String = "",
    val location: String = "",
    val grade: String = "U",
    val timestamp: Timestamp? = null
)

data class MarketPrice(
    val city: String = "",
    val retail: Int = 0,
    val wholesale: Int = 0,
    val date: String? = null,
    val history: List<PriceHistory>? = null
)

data class PriceHistory(
    val name: String = "",
    val price: Int = 0
)
