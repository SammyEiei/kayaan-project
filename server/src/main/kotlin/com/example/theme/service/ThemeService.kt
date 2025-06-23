package com.example.theme.service

import com.example.theme.dto.ThemeDto
import com.example.theme.entity.PredefinedTheme
import com.example.theme.entity.UserThemePreset
import com.example.theme.entity.UserThemeSetting
import com.example.theme.repo.PredefinedThemeRepository
import com.example.theme.repo.UserThemePresetRepository
import com.example.theme.repo.UserThemeSettingRepository
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ThemeService(
    private val predefinedRepo: PredefinedThemeRepository,
    private val presetRepo: UserThemePresetRepository,
    private val settingRepo: UserThemeSettingRepository
) {
    private val mapper = jacksonObjectMapper()

    fun getPredefined(): List<ThemeDto> =
        predefinedRepo.findAll().filter { it.isActive }.map { it.toDto() }

    fun getPresets(userId: Long): List<ThemeDto> =
        presetRepo.findByUserId(userId).map { it.toDto() }

    fun createPreset(userId: Long, dto: ThemeDto): ThemeDto {
        val preset = UserThemePreset(
            userId = userId,
            name = dto.name,
            colors = mapper.writeValueAsString(dto.colors),
            isDark = dto.isDark,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        return presetRepo.save(preset).toDto()
    }

    fun deletePreset(userId: Long, presetId: Long) {
        presetRepo.findById(presetId).ifPresent {
            if (it.userId == userId) presetRepo.delete(it)
        }
    }

    fun setActive(userId: Long, themeId: Long?, presetId: Long?) {
        val setting = settingRepo.findById(userId).orElse(UserThemeSetting(userId))
        setting.activeThemeId = themeId
        setting.activePresetId = presetId
        setting.updatedAt = LocalDateTime.now()
        settingRepo.save(setting)
    }

    fun getActive(userId: Long): UserThemeSetting? = settingRepo.findById(userId).orElse(null)

    fun reset(userId: Long) {
        settingRepo.deleteById(userId)
    }

    private fun PredefinedTheme.toDto() = ThemeDto(id, name, description, mapper.readValue(colors, Map::class.java) as Map<String, String>, isDark)
    private fun UserThemePreset.toDto() = ThemeDto(id, name, null, mapper.readValue(colors, Map::class.java) as Map<String, String>, isDark)
}
