package com.backofficedemo.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Payload for creating or updating a product.
 */
public record ProductRequest(

        @NotBlank @Size(max = 50)
        String sku,

        @NotBlank @Size(max = 200)
        String name,

        @NotBlank @Size(max = 100)
        String category,

        @NotNull @DecimalMin(value = "0.0", inclusive = true)
        BigDecimal price,

        @NotNull @Min(0)
        Integer stock,

        boolean active
) {}
