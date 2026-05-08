package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jenugumpu.app.ui.t

@Composable
fun ProfitScreen() {
    var quantity by remember { mutableStateOf(28f) }
    
    Column(modifier = Modifier.padding(16.dp)) {
        Text(t("profit.title"), fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(t("logs.quantity"), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Slider(
                    value = quantity,
                    onValueChange = { quantity = it },
                    valueRange = 1f..100f
                )
                Text("${quantity.toInt()} KG", fontWeight = FontWeight.Bold)
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        val rawPrice = quantity * 350
        val processedPrice = quantity * 750 - (quantity * 60) // Assuming 60 cost per kg
        
        Card(modifier = Modifier.fillMaxWidth()) {
            ListItem(
                headlineContent = { Text(t("profit.raw")) },
                trailingContent = { Text("₹${rawPrice.toInt()}") }
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f))) {
            ListItem(
                headlineContent = { Text(t("profit.processed"), fontWeight = FontWeight.Bold) },
                trailingContent = { Text("₹${processedPrice.toInt()}", fontWeight = FontWeight.Bold) }
            )
        }
    }
}
