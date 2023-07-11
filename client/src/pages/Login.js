import { Button, Container, Form } from 'react-bootstrap';
import React, { useState } from "react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { "username": username, "password": password };

      const response = await fetch(process.env.REACT_APP_SERVER_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      window.location = "/Real-Estate";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', paddingTop: 60 }}>
      <h1 style={{ margin: '20px' }}>Login</h1>
      <br />
      <Container style={{ width: '50%' }}>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="formBasicUsername" value={username} onChange={e => setUsername(e.target.value)}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="username" placeholder="Enter username" />
          </Form.Group>
          <br />
          <Form.Group className="mb-3" controlId="formBasicPassword" value={password} onChange={e => setPassword(e.target.value)}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <br />
          <br />
          <Button variant="primary" type="submit" className="Button">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}