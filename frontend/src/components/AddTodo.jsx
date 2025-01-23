// import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";  // To redirect after adding todo
import TodoDataService from "../services/todos";
import React,{useState} from 'react';

function AddTodo() {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [successMessage, setSuccessMessage] = useState(null); // For success message
  const navigate = useNavigate();  // Hook to navigate after success

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !memo) {
      alert("Please fill out both the title and description");
      return;
    }

    setLoading(true);  // Set loading to true
    setError(null);  // Reset error state
    setSuccessMessage(null);  // Reset success message state

    const newTodo = { title, memo };

    try {
      // Create new todo via TodoDataService
      const response = await TodoDataService.create(newTodo);
      console.log("Todo created:", response.data);

      // Show success message
      setSuccessMessage("Todo created successfully!");

      // Optionally, redirect to the list page after creation
      navigate('/');  // Navigate to the Todo list page

    } catch (error) {
      console.error("There was an error creating the todo:", error);
      setError("There was an error creating the todo. Please try again.");
    } finally {
      setLoading(false);  // Set loading to false
    }
  };

  return (
    <Container fluid="md" className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4 text-center">Create Todo</h2>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}

              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter todo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter todo description"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="form-control-lg"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading || !title || !memo}
                    className="py-3"
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
                        Creating...
                      </>
                    ) : (
                      "Create Todo"
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

export default AddTodo;