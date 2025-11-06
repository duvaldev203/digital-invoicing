package com.invoicing.spring_boot.config;

import org.springframework.data.domain.Pageable;


public class AppConstants {
    public static final Pageable PAGEABLE = Pageable.ofSize(10);
}