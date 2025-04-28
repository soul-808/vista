package com.vista.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.vista.backend")
public class VistaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VistaBackendApplication.class, args);
	}

}
