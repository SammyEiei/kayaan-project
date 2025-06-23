package com.example.theme.controller

import com.example.theme.dto.ThemeDto
import com.example.theme.entity.UserThemeSetting
import com.example.theme.service.ThemeService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ThemeController(private val service: ThemeService) {

    @GetMapping("/themes")
    fun predefined(): List<ThemeDto> = service.getPredefined()

    @GetMapping("/users/{userId}/presets")
    fun presets(@PathVariable userId: Long): List<ThemeDto> = service.getPresets(userId)

    @PostMapping("/users/{userId}/presets")
    @ResponseStatus(HttpStatus.CREATED)
    fun createPreset(@PathVariable userId: Long, @RequestBody dto: ThemeDto): ThemeDto =
        service.createPreset(userId, dto)

    @DeleteMapping("/users/{userId}/presets/{presetId}")
    fun deletePreset(@PathVariable userId: Long, @PathVariable presetId: Long) =
        service.deletePreset(userId, presetId)

    @GetMapping("/users/{userId}/theme")
    fun active(@PathVariable userId: Long): UserThemeSetting? = service.getActive(userId)

    @PutMapping("/users/{userId}/theme")
    fun setActive(
        @PathVariable userId: Long,
        @RequestParam(required = false) themeId: Long?,
        @RequestParam(required = false) presetId: Long?
    ) = service.setActive(userId, themeId, presetId)

    @PostMapping("/users/{userId}/reset-personalization")
    fun reset(@PathVariable userId: Long) = service.reset(userId)
}
