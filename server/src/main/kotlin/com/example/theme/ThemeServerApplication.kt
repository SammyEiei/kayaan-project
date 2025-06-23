package com.example.theme

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ThemeServerApplication

fun main(args: Array<String>) {
    runApplication<ThemeServerApplication>(*args)
}
