package com.project.Sadiq_ecom.service;

import com.project.Sadiq_ecom.model.Product;
import com.project.Sadiq_ecom.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.font.MultipleMaster;
import java.io.IOException;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllproduct() {
        return repo.findAll();
    }

    public Product getProductByID(int id) {
       return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
//        if (imageFile != null && imageFile.getSize() > 0) {
//
//            // This is the correct logic for saving the image data:
//            product.setImageName(imageFile.getOriginalFilename());
//            product.setImageType(imageFile.getContentType());
//            product.setImageData(imageFile.getBytes());
//        } else {
//            // If no file was successfully uploaded, set fields to null
//            product.setImageName(null);
//            product.setImageType(null);
//            product.setImageData(null);
//        }
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {

        product.setImageData(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProduct(String keyword) {
        return repo.searchProduct(keyword);
    }
}
