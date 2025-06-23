package com.example.theme.repo

import com.example.theme.entity.UserThemeSetting
import org.springframework.data.jpa.repository.JpaRepository

interface UserThemeSettingRepository : JpaRepository<UserThemeSetting, Long>
