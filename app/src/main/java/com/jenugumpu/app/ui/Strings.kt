package com.jenugumpu.app.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.viewmodel.compose.viewModel
import com.jenugumpu.app.viewmodel.MainViewModel

object Strings {
    private val translations = mapOf(
        "app.name" to mapOf("en" to "Jenu-Gumpu", "kn" to "ಜೇನು-ಗುಂಪು (Jenu-Gumpu)"),
        "app.subtitle" to mapOf("en" to "EMPOWERING HONEY HUNTERS", "kn" to "ಜೇನು ಕೃಷಿಕರ ಅಭಿವೃದ್ಧಿಗಾಗಿ"),
        "nav.home" to mapOf("en" to "HOME", "kn" to "ಮನೆ"),
        "nav.logs" to mapOf("en" to "LOGS", "kn" to "ದಾಖಲೆಗಳು"),
        "nav.prices" to mapOf("en" to "PRICES", "kn" to "ದರಗಳು"),
        "nav.collective" to mapOf("en" to "COLLECTIVE", "kn" to "ಗುಂಪು"),
        "nav.profit" to mapOf("en" to "PROFIT", "kn" to "ಲಾಭ"),
        "dash.welcome" to mapOf("en" to "Hello", "kn" to "ನಮಸ್ಕಾರ"),
        "dash.total_stock" to mapOf("en" to "TOTAL STOCK", "kn" to "ಒಟ್ಟು ದಾಸ್ತಾನು"),
        "dash.quick_actions" to mapOf("en" to "Quick Actions", "kn" to "ತ್ವರಿತ ಕ್ರಮಗಳು"),
        "dash.log_harvest" to mapOf("en" to "Log Harvest", "kn" to "ಸಂಗ್ರಹ ದಾಖಲಿಸಿ"),
        "dash.log_harvest_sub" to mapOf("en" to "NEW LOG", "kn" to "ಹೊಸ ದಾಖಲೆ"),
        "dash.grade_honey" to mapOf("en" to "Grade Honey", "kn" to "ದರ್ಜೆ ನಿರ್ಧರಿಸಿ"),
        "dash.grade_honey_sub" to mapOf("en" to "AI TESTING", "kn" to "AI ಪರೀಕ್ಷೆ"),
        "dash.prices" to mapOf("en" to "Prices", "kn" to "ಮಾರುಕಟ್ಟೆ"),
        "dash.prices_sub" to mapOf("en" to "DAILY RATES", "kn" to "ದೈನಂದಿನ ದರ"),
        "dash.group" to mapOf("en" to "Collective", "kn" to "ಸಂಘ"),
        "dash.group_sub" to mapOf("en" to "GROUP INFO", "kn" to "ಗುಂಪಿನ ಮಾಹಿತಿ"),
        "dash.recent" to mapOf("en" to "Recent Activity", "kn" to "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ"),
        "dash.view_all" to mapOf("en" to "View All", "kn" to "ಎಲ್ಲವನ್ನೂ ನೋಡಿ"),
        "logs.title" to mapOf("en" to "Logs", "kn" to "ದಾಖಲೆಗಳು"),
        "logs.add_harvest" to mapOf("en" to "Log Harvest", "kn" to "ಸುಗ್ಗಿ ದಾಖಲಿಸಿ"),
        "logs.quantity" to mapOf("en" to "QUANTITY (KG)", "kn" to "ಪ್ರಮಾಣ (ಕೆಜಿ)"),
        "logs.floral" to mapOf("en" to "FLORAL SOURCE", "kn" to "ಹೂವಿನ ಮೂಲ"),
        "logs.save" to mapOf("en" to "Save", "kn" to "ಉಳಿಸಿ"),
        "prices.title" to mapOf("en" to "Prices", "kn" to "ದರಗಳು"),
        "prices.retail" to mapOf("en" to "RETAIL PRICE", "kn" to "ಚಿಲ್ಲರೆ ದರ"),
        "prices.wholesale" to mapOf("en" to "WHOLESALE PRICE", "kn" to "ಸಗಟು ದರ"),
        "prices.gap" to mapOf("en" to "Gap", "kn" to "ವ್ಯತ್ಯಾಸ"),
        "prices.trend" to mapOf("en" to "7-Day Price Trend", "kn" to "7-ದಿನಗಳ ದರ ಪ್ರವೃತ್ತಿ"),
        "profit.title" to mapOf("en" to "Profit", "kn" to "ಲಾಭ"),
        "profit.simulator" to mapOf("en" to "PROFIT SIMULATOR", "kn" to "ಲಾಭದ ಲೆಕ್ಕಾಚಾರ"),
        "profit.processed" to mapOf("en" to "Process & Sell Retail", "kn" to "ಸಂಸ್ಕರಿಸಿ ಮಾರಾಟ ಮಾಡಿ"),
        "profit.raw" to mapOf("en" to "Sell to Middleman", "kn" to "ಖರೀದಿದಾರರಿಗೆ ಮಾರಿ"),
        "profile.title" to mapOf("en" to "Profile", "kn" to "ಪ್ರೊಫೈಲ್"),
        "profile.role_hunter" to mapOf("en" to "Hunter", "kn" to "ಕೃಷಿಕ"),
        "profile.role_manager" to mapOf("en" to "Manager", "kn" to "ವ್ಯವಸ್ಥಾಪಕ"),
        "profile.switch_role" to mapOf("en" to "Switch Role", "kn" to "ಪಾತ್ರ ಬದಲಿಸಿ"),
        "profile.sign_out" to mapOf("en" to "Sign Out", "kn" to "ನಿರ್ಗಮಿಸಿ"),
        "profile.language" to mapOf("en" to "Language", "kn" to "ಭಾಷೆ")
    )

    fun get(key: String, lang: String): String {
        return translations[key]?.get(lang) ?: key
    }
}

@Composable
fun t(key: String): String {
    val viewModel: MainViewModel = viewModel()
    val lang = viewModel.language.collectAsState().value
    return Strings.get(key, lang)
}
