package com.backofficedemo.product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    boolean existsBySku(String sku);

    Optional<Product> findBySku(String sku);

    // --- Dashboard aggregates ---

    long countByActiveTrue();

    @Query("select coalesce(sum(p.price * p.stock), 0) from Product p where p.active = true")
    BigDecimal totalInventoryValue();

    long countByStockLessThan(int threshold);

    @Query("select p.category, count(p) from Product p group by p.category order by count(p) desc")
    List<Object[]> countGroupedByCategory();
}
