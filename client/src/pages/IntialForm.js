import { Button, Container, Form } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";



export function IntialForm({ user }) {
  let { id } = useParams();
  const [form, setFrom] = useState({ 'propId': id, 'username': user.username });
  const [product, setProduct] = useState({});

  const getProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/products/${id}`, { credentials: 'include' });
      const jsonData = await response.json();
      setProduct(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const onSubmitForm = async e => {
    e.preventDefault();


    const body = { "status": 1 };

    const response = fetch(process.env.REACT_APP_SERVER_URL + `/applications/${id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: 'include'
    });


    try {
      const body1 = { "username": form.email, "password": form.password };

      const response1 = await fetch(process.env.REACT_APP_SERVER_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body1),
        credentials: 'include'
      });
      const jsonData = await response1.json();
      // alert(jsonData.message);  //alert if wrong password!

    } catch (err) {
      console.error(err.message);
    }

    try {
      const body2 = { "username": form.email, "password": form.password };
      const response2 = await fetch(process.env.REACT_APP_SERVER_URL + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body2),
        credentials: 'include'
      });
      const jsonData = await response2.json();
    } catch (err) {
      console.log(err);
      //login instead?
    }

    try {
      const response3 = await fetch(process.env.REACT_APP_SERVER_URL + `/applications/new-app/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'form': form }),
        credentials: 'include'
      });
      const jsonData = await response3.json();
      alert('Applicaton submitted!');

      window.location = "/Real-Estate";
    } catch (err) {
      console.error(err.message);
    }
  };


  return (
    <>
      <br />
      <div style={{ paddingTop: 90, display: 'flex', height: 600, justifyContent: 'space-around', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
          {product.img ? <img src={product.img} className="propImg" /> : ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
          <Container style={{ width: '100%' }}>
            <Form onSubmit={onSubmitForm}>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{}}>Intial Form</h1>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Form.Group style={{ width: '49%' }} className="mb-4" controlId="formBasicEmail" value={form.firstName} onChange={e => setFrom({ ...form, 'firstName': e.target.value })}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" />
                  </Form.Group>

                  <Form.Group style={{ width: '49%' }} className="mb43" controlId="formBasicEmail" value={form.lastName} onChange={e => setFrom({ ...form, 'lastName': e.target.value })}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" />
                  </Form.Group>
                </div>

                <Form.Group className="mb-4" controlId="formBasicEmail" value={form.university} onChange={e => setFrom({ ...form, 'university': e.target.value })}>
                  <Form.Label>University</Form.Label>
                  <Form.Control type="text" placeholder="University" />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicEmail" value={form.email} onChange={e => setFrom({ ...form, 'email': e.target.value })}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword" value={form.password} onChange={e => setFrom({ ...form, 'password': e.target.value })}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <br /><br />
              </div>
              <Button variant="primary" type="submit" className="Button">
                Submit
              </Button>
            </Form>
            <br /><br /><br />
            <Link to="/login" className='btn btn-success Button'>Login instead</Link>
          </Container>
        </div >
      </div>
    </>
  );
}