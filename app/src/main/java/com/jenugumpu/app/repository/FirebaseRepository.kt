package com.jenugumpu.app.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.jenugumpu.app.data.Harvest
import com.jenugumpu.app.data.MarketPrice
import com.jenugumpu.app.data.UserProfile
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class FirebaseRepository {
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    fun getCurrentUser() = auth.currentUser

    fun getUserProfile(uid: String): Flow<UserProfile?> = callbackFlow {
        val docRef = db.collection("users").document(uid)
        val subscription = docRef.addSnapshotListener { snapshot, _ ->
            val profile = snapshot?.toObject(UserProfile::class.java)
            trySend(profile)
        }
        awaitClose { subscription.remove() }
    }

    fun getHarvests(): Flow<List<Harvest>> = callbackFlow {
        val query = db.collection("harvests").orderBy("timestamp", Query.Direction.DESCENDING)
        val subscription = query.addSnapshotListener { snapshot, _ ->
            val harvests = snapshot?.documents?.mapNotNull { 
                it.toObject(Harvest::class.java)?.copy(id = it.id) 
            } ?: emptyList()
            trySend(harvests)
        }
        awaitClose { subscription.remove() }
    }

    fun getMarketPrices(): Flow<List<MarketPrice>> = callbackFlow {
        val query = db.collection("marketPrices")
        val subscription = query.addSnapshotListener { snapshot, _ ->
            val prices = snapshot?.documents?.mapNotNull { 
                it.toObject(MarketPrice::class.java) 
            } ?: emptyList()
            trySend(prices)
        }
        awaitClose { subscription.remove() }
    }

    suspend fun addHarvest(harvest: Harvest) {
        db.collection("harvests").add(harvest).await()
    }

    suspend fun updateUserProfile(profile: UserProfile) {
        db.collection("users").document(profile.uid).set(profile).await()
    }
    
    fun signOut() {
        auth.signOut()
    }
}
