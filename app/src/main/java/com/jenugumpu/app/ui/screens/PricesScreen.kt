package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.jenugumpu.app.ui.t
import com.jenugumpu.app.viewmodel.MainViewModel

@Composable
fun PricesScreen() {
    val viewModel: MainViewModel = viewModel()
    val prices by viewModel.marketPrices.collectAsState()

    Column(modifier = Modifier.padding(16.dp)) {
        Text(t("prices.title"), fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            items(prices) { price ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(price.city, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text(t("prices.retail"), fontSize = 10.sp)
                                Text("₹${price.retail}", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                            }
                            Column {
                                Text(t("prices.wholesale"), fontSize = 10.sp)
                                Text("₹${price.wholesale}", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
