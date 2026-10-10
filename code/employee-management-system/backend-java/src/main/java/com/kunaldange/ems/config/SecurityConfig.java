package com.kunaldange.ems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    /*
     * DEVELOPMENT SCAFFOLD ONLY.
     * The employee endpoints are temporarily open so the React CRUD screen can
     * be connected during the first implementation step. Do not deploy this
     * configuration. The next migration step replaces it with JWT authentication
     * and ADMIN / HR / EMPLOYEE authorization rules.
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health", "/error").permitAll()
                        .anyRequest().permitAll())
                .build();
    }
}
