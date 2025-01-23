import React, { useState } from "react";
import TodoDataService from "../services/todos";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner, Row, Col, Card } from "react-bootstrap";


function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error handling state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    const userData = { username, password };

    try {
      await TodoDataService.signup(userData);
      navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "An error occurred while signing up. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Hide loading spinner after request completes
    }
  };

  return (
    <Container fluid="md" className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Enter username"
                    value={username}
                    onChange={onChangeUsername}
                    className="form-control-lg"
                    minLength="3"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={onChangePassword}
                    className="form-control-lg"
                    minLength="6"
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    size="lg"
                    className="py-3"
                    disabled={!username || !password || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;