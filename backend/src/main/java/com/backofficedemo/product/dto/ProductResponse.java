package com.backofficedemo.product.dto;

import com.backofficedemo.product.Product;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Read model returned by the API.
 */
public record ProductResponse(
        Long id,
        String sku,
        String name,
        String category,
        BigDecimal price,
        Integer stock,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getSku(),
                p.getName(),
                p.getCategory(),
                p.getPrice(),
                p.getStock(),
                p.isActive(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
