package com.jenugumpu.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jenugumpu.app.data.Harvest
import com.jenugumpu.app.data.MarketPrice
import com.jenugumpu.app.data.UserProfile
import com.jenugumpu.app.repository.FirebaseRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    private val repository = FirebaseRepository()

    private val _userProfile = MutableStateFlow<UserProfile?>(null)
    val userProfile: StateFlow<UserProfile?> = _userProfile.asStateFlow()

    private val _harvests = MutableStateFlow<List<Harvest>>(emptyList())
    val harvests: StateFlow<List<Harvest>> = _harvests.asStateFlow()

    private val _marketPrices = MutableStateFlow<List<MarketPrice>>(emptyList())
    val marketPrices: StateFlow<List<MarketPrice>> = _marketPrices.asStateFlow()

    private val _language = MutableStateFlow("kn")
    val language: StateFlow<String> = _language.asStateFlow()

    init {
        viewModelScope.launch {
            val user = repository.getCurrentUser()
            if (user != null) {
                repository.getUserProfile(user.uid).collect { profile ->
                    _userProfile.value = profile
                }
            }
        }

        viewModelScope.launch {
            repository.getHarvests().collect { list ->
                _harvests.value = list
            }
        }

        viewModelScope.launch {
            repository.getMarketPrices().collect { list ->
                _marketPrices.value = list
            }
        }
    }

    fun setLanguage(lang: String) {
        _language.value = lang
    }

    fun addHarvest(harvest: Harvest) {
        viewModelScope.launch {
            repository.addHarvest(harvest)
        }
    }

    fun toggleRole() {
        val current = _userProfile.value ?: return
        val newRole = if (current.role == "hunter") "manager" else "hunter"
        viewModelScope.launch {
            repository.updateUserProfile(current.copy(role = newRole))
        }
    }

    fun signOut() {
        repository.signOut()
        _userProfile.value = null
    }
}
