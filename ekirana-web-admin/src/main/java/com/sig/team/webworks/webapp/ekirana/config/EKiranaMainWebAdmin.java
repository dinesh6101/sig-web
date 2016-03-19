package com.sig.team.webworks.webapp.ekirana.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.sig.team.webworks.webapp.ekirana")
public class EKiranaMainWebAdmin {
	public static void main(String[] args) {
		System.setProperty("spring.config.name", "ekirana-web-admin");
		SpringApplication.run(EKiranaMainWebAdmin.class, args);
	}
}
