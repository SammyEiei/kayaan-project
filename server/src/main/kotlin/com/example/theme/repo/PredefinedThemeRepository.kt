package com.example.theme.repo

import com.example.theme.entity.PredefinedTheme
import org.springframework.data.jpa.repository.JpaRepository

interface PredefinedThemeRepository : JpaRepository<PredefinedTheme, Long>
