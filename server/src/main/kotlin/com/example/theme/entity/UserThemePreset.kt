package com.example.theme.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class UserThemePreset(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    var userId: Long = 0,
    var name: String = "",
    @Column(columnDefinition = "json")
    var colors: String = "{}",
    var isDark: Boolean = false,
    var createdAt: LocalDateTime? = null,
    var updatedAt: LocalDateTime? = null
)
