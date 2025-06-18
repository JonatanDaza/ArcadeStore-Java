package com.Scrum3.ArcadeStore.controller;
import org.springframework.web.bind.annotation.*;


    @RestController
@RequestMapping("/api/productos")
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
