package com.backofficedemo.product.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated metrics for the dashboard view.
 */
public record DashboardStats(
        long totalProducts,
        long activeProducts,
        long lowStockProducts,
        BigDecimal inventoryValue,
        List<CategoryCount> productsByCategory
) {
    public record CategoryCount(String category, long count) {}
}
