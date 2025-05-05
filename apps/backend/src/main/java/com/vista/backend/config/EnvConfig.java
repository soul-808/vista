package com.vista.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
@Profile("!test") // Don't load in test environment
public class EnvConfig {

    @PostConstruct
    public void init() {
        // Load .env file from the backend folder
        try {
            // Try to find .env in the current directory or one level up
            File dotenvFile = new File(".env");
            String directory = dotenvFile.exists() ? "." : null;
            
            Dotenv dotenv = Dotenv.configure()
                    .directory(directory)
                    .ignoreIfMissing()  // Don't fail if .env doesn't exist
                    .load();
                    
            // Set environment variables from .env file
            dotenv.entries().forEach(entry -> {
                if (System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
            
            System.out.println("Loaded environment variables from .env file");
        } catch (Exception e) {
            // Just log the error but don't fail startup
            System.err.println("Failed to load .env file: " + e.getMessage());
        }
    }
} 