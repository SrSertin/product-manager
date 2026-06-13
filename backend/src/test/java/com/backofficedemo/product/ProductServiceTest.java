package com.backofficedemo.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.backofficedemo.common.DuplicateResourceException;
import com.backofficedemo.common.PageResponse;
import com.backofficedemo.common.ResourceNotFoundException;
import com.backofficedemo.product.dto.ProductRequest;
import com.backofficedemo.product.dto.ProductResponse;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    private ProductRequest sampleRequest(String sku) {
        return new ProductRequest(sku, "Test Product", "Electrónica",
                new BigDecimal("99.90"), 25, true);
    }

    @Test
    void createsAndReadsProduct() {
        ProductResponse created = productService.create(sampleRequest("TEST-001"));

        assertThat(created.id()).isNotNull();
        assertThat(created.sku()).isEqualTo("TEST-001");

        ProductResponse fetched = productService.getById(created.id());
        assertThat(fetched.name()).isEqualTo("Test Product");
    }

    @Test
    void rejectsDuplicateSku() {
        productService.create(sampleRequest("DUP-001"));

        assertThatThrownBy(() -> productService.create(sampleRequest("DUP-001")))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void throwsWhenProductMissing() {
        assertThatThrownBy(() -> productService.getById(999_999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void searchFiltersBySearchTerm() {
        productService.create(sampleRequest("FIND-ME-123"));

        PageResponse<ProductResponse> result =
                productService.search("FIND-ME", null, null, PageRequest.of(0, 10));

        assertThat(result.content())
                .extracting(ProductResponse::sku)
                .contains("FIND-ME-123");
    }

    @Test
    void dashboardReturnsAggregates() {
        var stats = productService.dashboard();

        assertThat(stats.totalProducts()).isPositive();
        assertThat(stats.inventoryValue()).isNotNull();
        assertThat(stats.productsByCategory()).isNotEmpty();
    }
}
