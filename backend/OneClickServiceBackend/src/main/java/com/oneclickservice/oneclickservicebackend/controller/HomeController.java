package com.oneclickservice.oneclickservicebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "OneClickService Backend funcionando correctamente";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
