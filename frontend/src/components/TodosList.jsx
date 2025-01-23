import React, { useState, useEffect } from "react";
import TodoDataService from "../services/todos";
import { Link } from "react-router-dom";
import { ListGroup, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";


function TodosList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    // Fetch all todos from the API
    TodoDataService.getAll()
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("There was an error fetching the todos.");
        setLoading(false);
      });
 
  }, []);

  const handleDelete = async (id) => {
    // Confirm before deletion
    if (window.confirm("Are you sure you want to delete this Todo?")) {
      setLoading(true); // Show loading state while deleting

      try {
        await TodoDataService.delete(id);  // Make the delete request to the API
        setTodos(todos.filter((todo) => todo.id !== id));  // Remove the deleted Todo from the state
      } catch (error) {
        setError("There was an error deleting the todo.");
      } finally {
        setLoading(false); // Hide the loading spinner
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid="md" className="py-4">
      <Row className="mb-4 align-items-center">
        <Col xs={12} sm={6}>
          <h2 className="mb-0">Your Todos</h2>
        </Col>
        <Col xs={12} sm={6} className="text-sm-end mt-3 mt-sm-0">
          <Link to="/todos/create">
            <Button variant="primary" size="lg">
              Add Todo
            </Button>
          </Link>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <ListGroup className="shadow-sm">
        {todos.length === 0 ? (
          <Alert variant="info" className="text-center py-4">
            You have no todos. Create one!
          </Alert>
        ) : (
          todos.map((todo) => (
            <ListGroup.Item 
              key={todo.id}
              className="d-flex justify-content-between align-items-center p-3 hover-bg-light"
            >
              <div className="me-3 flex-grow-1">
                <h5 className="mb-1">{todo.title}</h5>
                {todo.description && (
                  <p className="text-muted mb-0 small">{todo.description}</p>
                )}
              </div>
              <div className="d-flex gap-2">
                <Link to={`/todos/edit/${todo.id}`}>
                  <Button variant="warning" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
}

export default TodosList;