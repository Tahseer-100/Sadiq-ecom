package com.project.Sadiq_ecom.controller;
import com.project.Sadiq_ecom.model.Product;
import com.project.Sadiq_ecom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import javax.swing.plaf.synth.SynthOptionPaneUI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

//    private final ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping("/products")
    public ResponseEntity<List<Product>> getAllproduct() {
        return new ResponseEntity<>(service.getAllproduct(), HttpStatus.OK);
    }


//    @GetMapping("/product/{id}")
//    public ResponseEntity<Product> getProduct(@PathVariable int id) {
//
//        Product product = service.getProductByID(id);
//        if (product != null)
//            return new ResponseEntity<>(product, HttpStatus.OK);
//        else
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id) {
        System.out.println("Getting product with ID: " + id);

        // Log authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication: " + (auth != null ? auth.getName() : "null"));
        System.out.println("Authorities: " + (auth != null ? auth.getAuthorities() : "null"));

        Product product = service.getProductByID(id);
        if (product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

//    @PostMapping("/product")
////    public ResponseEntity<?> addProduct(@RequestPart("product") String productJson,
////                                        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
//    public ResponseEntity<?> addProduct(@RequestPart Product product,
//                                        @RequestPart MultipartFile imageFile) {
//        try {
////            Product product = objectMapper.readValue(productJson, Product.class);
//            Product prod = service.addProduct(product, imageFile);
//
//            return new ResponseEntity<>(prod, HttpStatus.CREATED);
//        } catch (Exception e) {
//            System.err.println("Product Add Error: " + e.getMessage());
//            return new ResponseEntity<>("Error adding product: " + e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }
@PostMapping("/product")
public ResponseEntity<?> addProduct(@RequestPart Product product,
                                    @RequestPart MultipartFile imageFile) {
    try {
        // Log the authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("=== ADDING PRODUCT ===");
        System.out.println("Authenticated: " + (auth != null));
        if (auth != null) {
            System.out.println("User: " + auth.getName());
            System.out.println("Authorities: " + auth.getAuthorities());
        }

        Product prod = service.addProduct(product, imageFile);
        return new ResponseEntity<>(prod, HttpStatus.CREATED);
    } catch (Exception e) {
        System.err.println("Product Add Error: " + e.getMessage());
        e.printStackTrace();
        return new ResponseEntity<>("Error adding product: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

    @GetMapping("product/{ProdID}/image")
    public ResponseEntity<byte[]> getImageByID(@PathVariable int ProdID) {
        Product product = service.getProductByID(ProdID);
        byte[] imageFile = product.getImageData();
        return ResponseEntity.ok()
//                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id,
                                                @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile) {
        Product prod = null;
        try {
            prod = service.updateProduct(id, product, imageFile);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        }
        if (prod != null) {
            return new ResponseEntity<>("Product Updated succesfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product prod = service.getProductByID(id);
        if (prod != null) {
            service.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam String keyword) {
        System.out.println("Searching With "+keyword);
        List<Product> prod = service.searchProduct(keyword);
        return new ResponseEntity<>(prod, HttpStatus.OK);
    }
}
