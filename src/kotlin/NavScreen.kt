package com.example.carapp

import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.model.*
import androidx.car.app.navigation.model.NavigationTemplate
import androidx.car.app.navigation.model.RoutingInfo
import androidx.car.app.navigation.model.Step
import androidx.car.app.navigation.model.Maneuver

class NavScreen(carContext: CarContext) : Screen(carContext) {
    override fun onGetTemplate(): Template {
        val routingInfo = RoutingInfo.Builder()
            .setCurrentStep(
                Step.Builder("Skręć w prawo w ul. Marszałkowską")
                    .setManeuver(Maneuver.Builder(Maneuver.TYPE_TURN_RIGHT_NORMAL).build())
                    .build(),
                Distance.create(350.0, Distance.UNIT_METERS)
            ).build()

        return NavigationTemplate.Builder()
            .setNavigationInfo(routingInfo)
            .setTitle("Nawigacja")
            .setActionStrip(
                ActionStrip.Builder()
                    .addAction(Action.Builder()
                        .setTitle("Szukaj")
                        .setOnClickListener { /* Search */ }
                        .build())
                    .build()
            )
            .build()
    }
}
