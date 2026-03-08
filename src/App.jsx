import "./App.css";
import React, { useState, useContext } from "react"; //ADDED useContext
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProduct from "./components/UpdateProduct";
import AppContext from "./Context/Context"; // ADDED
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  // const addToCart = (product) => {
  //   //ADDED
  //   console.log("Adding to cart:", product); //  "
  // }; //  "

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Navbar onSelectCategory={handleCategorySelect} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home
                selectedCategory={selectedCategory}
                // addToCart={addToCart} //ADDED
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add_product"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/update/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
