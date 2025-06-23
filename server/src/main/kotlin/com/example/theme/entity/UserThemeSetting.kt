package com.example.theme.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.time.LocalDateTime

@Entity
class UserThemeSetting(
    @Id
    var userId: Long = 0,
    var activeThemeId: Long? = null,
    var activePresetId: Long? = null,
    var updatedAt: LocalDateTime? = null
)
