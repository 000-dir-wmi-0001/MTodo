import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import TodoDataService from "../services/todos";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await TodoDataService.login({ username, password });
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        onLogin({ username, token: response.data.token });
        navigate("/");
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.detail || 
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">Login</h2>
              
              {error && (
                <Alert 
                  variant="danger" 
                  className="mb-4 text-center"
                >
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit} className="mb-3">
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control-lg bg-light"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control-lg bg-light"
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || !username || !password}
                    size="lg"
                    className="py-3 fw-medium"
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner
                          as="span"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
                <p className="mt-3 mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none">
                    Sign up
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;