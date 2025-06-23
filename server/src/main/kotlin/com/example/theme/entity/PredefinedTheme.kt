package com.example.theme.entity

import jakarta.persistence.*

@Entity
class PredefinedTheme(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    var name: String = "",
    var description: String? = null,
    @Column(columnDefinition = "json")
    var colors: String = "{}",
    var isActive: Boolean = true,
    var isDark: Boolean = false
)
