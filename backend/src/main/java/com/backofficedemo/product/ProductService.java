package com.backofficedemo.product;

import com.backofficedemo.common.DuplicateResourceException;
import com.backofficedemo.common.PageResponse;
import com.backofficedemo.common.ResourceNotFoundException;
import com.backofficedemo.product.dto.DashboardStats;
import com.backofficedemo.product.dto.ProductRequest;
import com.backofficedemo.product.dto.ProductResponse;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PageResponse<ProductResponse> search(String search, String category, Boolean active,
                                                Pageable pageable) {
        List<Specification<Product>> specs = new ArrayList<>();
        addIfPresent(specs, ProductSpecifications.nameOrSkuContains(search));
        addIfPresent(specs, ProductSpecifications.hasCategory(category));
        addIfPresent(specs, ProductSpecifications.isActive(active));

        Specification<Product> combined = specs.stream().reduce(Specification::and).orElse(null);
        Page<ProductResponse> page = productRepository.findAll(combined, pageable)
                .map(ProductResponse::from);
        return PageResponse.from(page);
    }

    public ProductResponse getById(Long id) {
        return ProductResponse.from(findOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new DuplicateResourceException("A product with SKU '" + request.sku() + "' already exists");
        }
        Product product = Product.builder()
                .sku(request.sku())
                .name(request.name())
                .category(request.category())
                .price(request.price())
                .stock(request.stock())
                .active(request.active())
                .build();
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOrThrow(id);
        if (!product.getSku().equals(request.sku()) && productRepository.existsBySku(request.sku())) {
            throw new DuplicateResourceException("A product with SKU '" + request.sku() + "' already exists");
        }
        product.setSku(request.sku());
        product.setName(request.name());
        product.setCategory(request.category());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setActive(request.active());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findOrThrow(id);
        productRepository.delete(product);
    }

    public DashboardStats dashboard() {
        List<DashboardStats.CategoryCount> byCategory = productRepository.countGroupedByCategory().stream()
                .map(row -> new DashboardStats.CategoryCount((String) row[0], (Long) row[1]))
                .toList();

        return new DashboardStats(
                productRepository.count(),
                productRepository.countByActiveTrue(),
                productRepository.countByStockLessThan(LOW_STOCK_THRESHOLD),
                productRepository.totalInventoryValue(),
                byCategory);
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private static void addIfPresent(List<Specification<Product>> specs, Specification<Product> spec) {
        if (spec != null) {
            specs.add(spec);
        }
    }
}
