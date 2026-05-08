package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Category // Just in case
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.jenugumpu.app.ui.t
import com.jenugumpu.app.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen() {
    val viewModel: MainViewModel = viewModel()
    val profile by viewModel.userProfile.collectAsState()
    val harvests by viewModel.harvests.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Column {
                Text(
                    text = "${t("dash.welcome")}, ${profile?.name ?: "Hunter"}",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = t("app.subtitle"),
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp
                )
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondary),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text(
                        t("dash.total_stock"), 
                        color = MaterialTheme.colorScheme.onSecondary.copy(alpha = 0.6f), 
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        "${profile?.totalHarvested ?: 0.0} KG", 
                        color = MaterialTheme.colorScheme.onSecondary, 
                        fontSize = 36.sp, 
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        item {
            Text(t("dash.quick_actions"), fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                QuickActionCard(
                    modifier = Modifier.weight(1f),
                    title = t("dash.log_harvest"),
                    subtitle = t("dash.log_harvest_sub"),
                    icon = Icons.Default.Add
                )
                QuickActionCard(
                    modifier = Modifier.weight(1f),
                    title = t("dash.grade_honey"),
                    subtitle = t("dash.grade_honey_sub"),
                    icon = Icons.Outlined.Star
                )
            }
        }

        item {
            Text(t("dash.recent"), fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        items(harvests.take(5)) { harvest ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("${harvest.quantity} KG", fontWeight = FontWeight.Bold)
                        Text(harvest.floralSource, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    }
                    Badge(containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)) {
                        Text("Grade ${harvest.grade}", modifier = Modifier.padding(4.dp), color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}

@Composable
fun QuickActionCard(modifier: Modifier, title: String, subtitle: String, icon: ImageVector) {
    Card(
        modifier = modifier.height(120.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.Center) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.height(8.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(subtitle, fontSize = 8.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Black)
        }
    }
}
