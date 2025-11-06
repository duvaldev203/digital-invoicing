package com.invoicing.spring_boot.exceptions;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class NotFoundException extends RuntimeException {

    public NotFoundException(String name) {
        super(String.format("%s n'a pas ete trouve !!!", name));
    }

    public NotFoundException(String name, Long id) {
        super(String.format("%s avec l'id %d n'a pas ete trouve !!!", name, id));
    }


}
