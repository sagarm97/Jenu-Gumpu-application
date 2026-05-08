package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.jenugumpu.app.ui.t
import com.jenugumpu.app.viewmodel.MainViewModel

@Composable
fun ProfileScreen() {
    val viewModel: MainViewModel = viewModel()
    val profile by viewModel.userProfile.collectAsState()
    val lang by viewModel.language.collectAsState()

    Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(t("profile.title"), fontSize = 28.sp, fontWeight = FontWeight.Bold, modifier = Modifier.align(Alignment.Start))
        Spacer(modifier = Modifier.height(24.dp))
        
        Text(profile?.name ?: "User", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text(profile?.role?.uppercase() ?: "HUNTER", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Card(modifier = Modifier.fillMaxWidth()) {
            Column {
                ListItem(
                    headlineContent = { Text(t("profile.switch_role")) },
                    leadingContent = { Icon(Icons.Default.Refresh, contentDescription = null) },
                    trailingContent = {
                        Button(onClick = { viewModel.toggleRole() }) {
                            Text("Switch")
                        }
                    }
                )
                Divider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
                ListItem(
                    headlineContent = { Text(t("profile.language")) },
                    supportingContent = { Text(if (lang == "en") "English" else "ಕನ್ನಡ") },
                    leadingContent = { Icon(Icons.Default.Public, contentDescription = null) },
                    trailingContent = {
                        Switch(checked = lang == "en", onCheckedChange = { viewModel.setLanguage(if (it) "en" else "kn") })
                    }
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))
        
        Button(
            onClick = { viewModel.signOut() },
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
            modifier = Modifier.fillMaxWidth(),
            shape = MaterialTheme.shapes.large
        ) {
            Icon(Icons.Default.ExitToApp, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(t("profile.sign_out"))
        }
    }
}
