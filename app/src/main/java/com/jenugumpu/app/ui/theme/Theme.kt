package com.jenugumpu.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = Amber500,
    secondary = BrandSecondary,
    tertiary = Amber400,
    background = Amber50,
    surface = White,
    onPrimary = White,
    onSecondary = White,
    onTertiary = Black,
    onBackground = BrandSecondary,
    onSurface = BrandSecondary,
)

@Composable
fun JenuGumpuTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
