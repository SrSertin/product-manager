package com.backofficedemo.product;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Reusable, composable JPA Specifications for product filtering.
 */
final class ProductSpecifications {

    private ProductSpecifications() {}

    static Specification<Product> nameOrSkuContains(String search) {
        if (!StringUtils.hasText(search)) {
            return null;
        }
        String like = "%" + search.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("sku")), like));
    }

    static Specification<Product> hasCategory(String category) {
        if (!StringUtils.hasText(category)) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("category"), category);
    }

    static Specification<Product> isActive(Boolean active) {
        if (active == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }
}
