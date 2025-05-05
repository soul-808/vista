package com.vista.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;
import java.nio.file.Paths;

@SpringBootApplication(scanBasePackages = "com.vista.backend")
public class VistaBackendApplication {

	public static void main(String[] args) {
		// Load .env file
		try {
			// Print current working directory and .env file paths for debugging
			String currentDir = System.getProperty("user.dir");
			
			// Check if .env exists in current directory
			File envFile = new File(currentDir + "/.env");
			
			// Also check parent directory (in case we're in apps/backend)
			File parentEnvFile = new File(currentDir + "/../.env");
			
			// Try to load from current directory
			Dotenv dotenv = Dotenv.configure().directory(currentDir).load();
			
			// Print loaded environment variables (keys only, for security)
			dotenv.entries().forEach(entry -> {
				if (System.getenv(entry.getKey()) == null) {
					System.setProperty(entry.getKey(), entry.getValue());
				}
			});
			
			System.out.println("Loaded environment variables from .env file");
		} catch (Exception e) {
			System.err.println("Warning: Could not load .env file: " + e.getMessage());
			e.printStackTrace();
		}
		
		SpringApplication.run(VistaBackendApplication.class, args);
	}

}
