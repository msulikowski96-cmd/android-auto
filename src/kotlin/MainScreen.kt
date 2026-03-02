package com.example.carapp

import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.model.*

class MainScreen(carContext: CarContext) : Screen(carContext) {
    override fun onGetTemplate(): Template {
        val row = Row.Builder()
            .setTitle("Witaj w Android Auto!")
            .addText("Wybierz moduł z menu bocznego.")
            .build()

        val pane = Pane.Builder()
            .addRow(row)
            .build()

        return PaneTemplate.Builder(pane)
            .setHeaderAction(Action.APP_ICON)
            .setTitle("Panel Główny")
            .build()
    }
}
