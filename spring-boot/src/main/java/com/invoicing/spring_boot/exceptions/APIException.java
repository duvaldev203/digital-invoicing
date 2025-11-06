package com.invoicing.spring_boot.exceptions;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class APIException extends RuntimeException {

    public APIException(String message) {
        super(message);
    }
}
