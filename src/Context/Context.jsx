import api from "../axios";
import { useState, useEffect, createContext } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  clearCart: () => {},
  isAdmin: false,
  canModifyProduct: (productId) => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );

  const { user } = useAuth();

  const addToCart = (product) => {
    console.log("addToCart called with product:", product);
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id,
    );
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert(`Added another ${product.name} to cart!`);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID", productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("CART", cart);
  };

  const refreshData = async () => {
    try {
      // FIXED: Changed from axios.get to api.get
      const response = await api.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  const canModifyProduct = (productId) => {
    return isAdmin();
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        isAdmin: isAdmin(),
        canModifyProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
