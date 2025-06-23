package com.example.theme.dto

data class ThemeDto(
    val id: Long? = null,
    val name: String,
    val description: String? = null,
    val colors: Map<String, String>,
    val isDark: Boolean = false
)
