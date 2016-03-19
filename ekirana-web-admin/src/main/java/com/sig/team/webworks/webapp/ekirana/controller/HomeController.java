package com.sig.team.webworks.webapp.ekirana.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@Value("${application.message:Hello World}")
	private String message = "Hello World";

	@RequestMapping({ "/home.html", "/home", "/" })
	public String home() {
		return "redirect:static/prototype/dashboard.jsp";
	}
}
