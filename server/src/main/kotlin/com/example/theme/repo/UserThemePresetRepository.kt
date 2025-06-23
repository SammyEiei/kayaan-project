package com.example.theme.repo

import com.example.theme.entity.UserThemePreset
import org.springframework.data.jpa.repository.JpaRepository

interface UserThemePresetRepository : JpaRepository<UserThemePreset, Long> {
    fun findByUserId(userId: Long): List<UserThemePreset>
}
