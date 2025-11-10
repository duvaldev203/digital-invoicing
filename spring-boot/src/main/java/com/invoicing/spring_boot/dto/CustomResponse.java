package com.invoicing.spring_boot.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
public class CustomResponse {

    private String message;

    private Timestamp timestamp;
}
