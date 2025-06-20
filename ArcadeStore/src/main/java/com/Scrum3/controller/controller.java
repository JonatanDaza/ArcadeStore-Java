package com.Scrum3.controller;
import org.springframework.web.bind.annotation.*;


class ProductoControllers {

        @GetMapping
    public String obtenerProductos() {
        return "licencias";
    }

    @PostMapping
    public String agregarProducto(@RequestBody String producto) {
        return "licencias recibidas: " + producto;
    }
}
