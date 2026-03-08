import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axios"; // FIXED: Import api instead of axios
import { useAuth } from "../Context/AuthContext";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleChange = async (value) => {
    setInput(value);

    if (value.length >= 2) {
      setShowSearchResults(true);
      setLoading(true);
      try {
        // FIXED: Using api instead of axios
        const response = await api.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
    "Household",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand" to="https://www.amazon.in/">
              Sadiq
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product">
                    Add Product
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-person-circle me-1"></i>
                        {user?.name || "Profile"}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <span className="dropdown-item-text text-muted">
                            Role: {user?.role}
                          </span>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        <i className="bi bi-person-plus me-1"></i>
                        Register
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <i className="bi bi-cart me-1"></i>
                    Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="theme-btn" onClick={toggleTheme}>
                    {theme === "dark-theme" ? (
                      <i className="bi bi-moon-fill"></i>
                    ) : (
                      <i className="bi bi-sun-fill"></i>
                    )}
                  </button>
                </li>
              </ul>

              {/* Search Bar */}
              <div
                className="d-flex position-relative ms-2"
                style={{ width: "300px" }}
              >
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() =>
                    input.length >= 2 && setShowSearchResults(true)
                  }
                  onBlur={() => {
                    setTimeout(() => setShowSearchResults(false), 200);
                  }}
                />
                {loading && (
                  <div className="position-absolute top-100 start-0 w-100 mt-1 p-2 text-center bg-white border rounded">
                    Loading...
                  </div>
                )}
                {showSearchResults && !loading && (
                  <ul
                    className="list-group position-absolute top-100 start-0 w-100 mt-1"
                    style={{ zIndex: 1000 }}
                  >
                    {searchResults.length > 0
                      ? searchResults.map((result) => (
                          <li
                            key={result.id}
                            className="list-group-item list-group-item-action p-0"
                          >
                            <Link
                              to={`/product/${result.id}`}
                              className="text-decoration-none text-dark d-block p-2"
                              onClick={() => setShowSearchResults(false)}
                            >
                              <div className="d-flex align-items-center">
                                <div>
                                  <strong>{result.name}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {result.brand} - ${result.price}
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))
                      : noResults && (
                          <li className="list-group-item text-danger">
                            No products found matching "{input}"
                          </li>
                        )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
