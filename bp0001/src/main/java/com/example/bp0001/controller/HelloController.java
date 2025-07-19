package com.example.bp0001.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/api/public/hello")
    public String hello() {
        return "Hello, world!";
    }
}
 