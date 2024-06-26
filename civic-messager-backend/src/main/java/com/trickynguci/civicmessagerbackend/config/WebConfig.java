package com.trickynguci.civicmessagerbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    private String clientUrl = "a";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(clientUrl,"http://localhost:5173","*")
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH")
                .allowedHeaders("*");
    }
}
