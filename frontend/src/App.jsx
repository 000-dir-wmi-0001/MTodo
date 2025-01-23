import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap";
import TodosList from "./components/TodosList";
import AddTodo from "./components/AddTodo";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setToken(userData.token);
    setUser(userData.username);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", userData.username);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar bg="dark" variant="dark" expand="md" className="py-3">
          <Container>
            <Navbar.Brand as={Link} to="/" className="fs-4">Todo App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto gap-2">
                {user ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-light">Welcome, {user}!</span>
                    <Button 
                      variant="outline-light" 
                      onClick={logout}
                      className="px-4"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Link to="/login" className="text-decoration-none">
                      <Button variant="outline-light" className="px-4">Login</Button>
                    </Link>
                    <Link to="/signup" className="text-decoration-none">
                      <Button variant="outline-light" className="px-4">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="py-4 flex-grow-1">
          <div className="bg-light p-4 rounded shadow-sm">
            <Routes>
              <Route 
                path="/" 
                element={token ? <TodosList token={token} /> : <Login onLogin={login} />} 
              />
              <Route
                path="/todos/create"
                element={token ? <AddTodo token={token} /> : <Login onLogin={login} />}
              />
              <Route
                path="/todos/edit/:id"
                element={token ? <AddTodo token={token} /> : <Login onLogin={login} />}
              />
              <Route path="/login" element={<Login onLogin={login} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </Container>
      </div>
    </Router>
  );
}

export default App;