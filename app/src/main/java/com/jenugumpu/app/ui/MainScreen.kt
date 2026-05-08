package com.jenugumpu.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.*
import com.jenugumpu.app.ui.screens.*

sealed class Screen(val route: String, val icon: ImageVector, val labelKey: String) {
    object Dashboard : Screen("dashboard", Icons.Default.Home, "nav.home")
    object Logs : Screen("logs", Icons.Default.ListAlt, "nav.logs")
    object Prices : Screen("prices", Icons.Default.ShowChart, "nav.prices")
    object Collective : Screen("collective", Icons.Default.People, "nav.collective")
    object Profit : Screen("profit", Icons.Default.ShoppingCart, "nav.profit")
    object Profile : Screen("profile", Icons.Default.Person, "nav.profile")
}

@Composable
fun MainScreen() {
    val navController = rememberNavController()
    val screens = listOf(
        Screen.Dashboard,
        Screen.Logs,
        Screen.Prices,
        Screen.Collective,
        Screen.Profit,
        Screen.Profile
    )

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(t(screen.labelKey), maxLines = 1) },
                        selected = currentDestination?.route == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = Screen.Dashboard.route, modifier = Modifier.padding(innerPadding)) {
            composable(Screen.Dashboard.route) { DashboardScreen() }
            composable(Screen.Logs.route) { LogsScreen() }
            composable(Screen.Prices.route) { PricesScreen() }
            composable(Screen.Collective.route) { CollectiveScreen() }
            composable(Screen.Profit.route) { ProfitScreen() }
            composable(Screen.Profile.route) { ProfileScreen() }
        }
    }
}
