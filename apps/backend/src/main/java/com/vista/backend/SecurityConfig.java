package com.vista.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health").permitAll() // ✅ public access
                .anyRequest().authenticated()              // 🔐 all others require login
            )
            .httpBasic(); // or .formLogin() if you prefer

        return http.build();
    }
}
