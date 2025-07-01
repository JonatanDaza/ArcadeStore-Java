package com.Scrum3.ArcadeStore.controller;

import com.Scrum3.ArcadeStore.dto.ContactForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<String> enviarMensaje(@RequestBody ContactForm form) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo("ikernell.suport@gmail.com");
            mensaje.setSubject("Mensaje desde ArcadeStore: " + form.getAsunto());
            mensaje.setText("Nombre: " + form.getNombre() + "\n" +
                    "Email: " + form.getEmail() + "\n\n" +
                    "Mensaje:\n" + form.getMensaje());

            mailSender.send(mensaje);

            return ResponseEntity.ok("Mensaje enviado con éxito.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al enviar el mensaje: " + e.getMessage());
        }
    }
}
