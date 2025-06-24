// Ubicación probable: src/main/java/com/Scrum3/ArcadeStore/config/SecurityConfig.java

package com.Scrum3.ArcadeStore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .httpBasic();
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.withUsername("Edgard") // Nombre de usuario
                .password(passwordEncoder.encode("1000213418")) // Contraseña codificada (aquí es 'password')
                .roles("ADMIN") // Rol/s del usuario
                .build();

        UserDetails user2 = User.withUsername("Alexander") // Otro usuario de ejemplo
                .password(passwordEncoder.encode("3212050640")) // Contraseña codificada
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user, user2);
    }

    // Bean para el codificador de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}