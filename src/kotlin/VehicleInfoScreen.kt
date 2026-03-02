package com.example.carapp

import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.hardware.CarHardwareManager
import androidx.car.app.hardware.info.CarHardwareExecutor
import androidx.car.app.model.*

class VehicleInfoScreen(carContext: CarContext) : Screen(carContext) {
    private var speed: Float = 0f
    private var fuelLevel: Float = 0f

    init {
        val hardware = carContext.getCarService(CarHardwareManager::class.java)
        
        hardware.carSensors.addSpeedListener(CarHardwareExecutor.UI) { data ->
            speed = data.rawSpeedMetersPerSecond.value ?: 0f
            invalidate()
        }

        hardware.carInfo.addEnergyLevelListener(CarHardwareExecutor.UI) { data ->
            fuelLevel = data.fuelVolumeDisplayUnit.value ?: 0f
            invalidate()
        }
    }

    override fun onGetTemplate(): Template {
        val pane = Pane.Builder()
            .addRow(Row.Builder().setTitle("Prędkość").addText("${speed} km/h").build())
            .addRow(Row.Builder().setTitle("Paliwo").addText("${fuelLevel}%").build())
            .build()

        return PaneTemplate.Builder(pane)
            .setTitle("Dane Pojazdu")
            .setHeaderAction(Action.BACK)
            .build()
    }
}
