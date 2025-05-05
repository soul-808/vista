package com.vista.backend.controller;

import com.vista.backend.service.UserService;
import com.vista.backend.entity.User;
import com.vista.backend.dto.LoginRequest;
import com.vista.backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            if (!loginRequest.getRole().equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Role mismatch");
            }
            String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
} 