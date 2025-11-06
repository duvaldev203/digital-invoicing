package com.invoicing.spring_boot.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.Timestamp;
import java.util.Date;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<APIResponse> notFoundException(NotFoundException e) {
        String message = e.getMessage();
        Timestamp timestamp = new Timestamp(new Date().getTime());

        APIResponse res = new APIResponse(timestamp, message, false);

        return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<APIResponse> myAPIException(APIException e) {
        String message = e.getMessage();
        Timestamp timestamp = new Timestamp(new Date().getTime());

        APIResponse res = new APIResponse(timestamp, message, false);

        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
}
