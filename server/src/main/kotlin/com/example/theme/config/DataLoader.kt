package com.example.theme.config

import com.example.theme.entity.PredefinedTheme
import com.example.theme.repo.PredefinedThemeRepository
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component

@Component
class DataLoader(private val repo: PredefinedThemeRepository) {
    @PostConstruct
    fun init() {
        if (repo.count() == 0L) {
            val mapper = jacksonObjectMapper()
            val themes = listOf(
                PredefinedTheme(name = "Light", description = "Default light", colors = mapper.writeValueAsString(mapOf(
                    "primary" to "#7E69AB",
                    "secondary" to "#1EAEDB",
                    "background" to "#ffffff",
                    "foreground" to "#0a0a0a",
                    "accent" to "#f4f4f5"
                )), isDark = false),
                PredefinedTheme(name = "Dark", description = "Dark mode", colors = mapper.writeValueAsString(mapOf(
                    "primary" to "#9b87f5",
                    "secondary" to "#33C3F0",
                    "background" to "#0a0a0a",
                    "foreground" to "#fafafa",
                    "accent" to "#27272a"
                )), isDark = true),
                PredefinedTheme(name = "Ocean", description = "Ocean blue", colors = mapper.writeValueAsString(mapOf(
                    "primary" to "#0891b2",
                    "secondary" to "#06b6d4",
                    "background" to "#f0f9ff",
                    "foreground" to "#0c4a6e",
                    "accent" to "#e0f2fe"
                )), isDark = false)
            )
            repo.saveAll(themes)
        }
    }
}
