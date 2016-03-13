package com.sig.team.webworks.webapp.ekirana.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class GroceryController {

	@RequestMapping(value = "/grocery/{grocerycategoryname}/{itemcategoryname}/{items}", method = RequestMethod.GET)
	public String getItemsDetails(@PathVariable("grocerycategoryname") String grocerycategoryname, @PathVariable("itemcategoryname") String itemcategoryname, @PathVariable("items") String items) {
		System.out.println("grocerycategoryname:" + grocerycategoryname);
		System.out.println("itemcategoryname:" + itemcategoryname);
		System.out.println("items:" + items);
		return "items";
	}

	@RequestMapping(value = "/grocery/{grocerycategoryname}/{itemcategoryname}", method = RequestMethod.GET)
	public String getItemCategoryDetails(HttpServletResponse response, HttpServletRequest request, @PathVariable String grocerycategoryname, @PathVariable String itemcategoryname) {
		System.out.println("grocerycategoryname:" + grocerycategoryname);
		System.out.println("itemcategoryname:" + itemcategoryname);
		request.setAttribute("itemcategoryid", 1);
		request.setAttribute("grocerycategoryid", 1);
		return "home";
	}

	@RequestMapping(value = "/grocery/{grocerycategoryname}", method = RequestMethod.GET)
	public String getGroceryCategoryDetails(HttpServletResponse response, HttpServletRequest request, @PathVariable String grocerycategoryname) {
		System.out.println("grocerycategoryname:" + grocerycategoryname);
		return "home";
	}
}