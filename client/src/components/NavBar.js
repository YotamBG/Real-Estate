import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import React from 'react';

export function NavBar({ user }) {

  const { pathname } = useLocation();

  return (
    <Navbar collapseOnSelect={true} expand="lg" className='NavBar' style={{ height: (window.innerWidth > 480 ? 60 : 90) }}>
      <Container >

        <Navbar.Brand href="/Real-Estate/" >
          <h4 style={{ letterSpacing: '2px', fontWeight: 'bold', color: ((pathname == '/' || pathname == '/aboutUs') ? 'white' : 'black') }}>AVANCE CAPITAL LLC</h4>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' style={{ borderRadius: 10, backgroundColor: (window.innerWidth > 480 ? 'none' : 'white') }}>
          <Nav className="justify-content-end">
            <Nav.Link href='/Real-Estate/productList' to="productList" className='nav-link' >PORTFOLIO</Nav.Link>
            <Nav.Link href='/Real-Estate/aboutUs' to="aboutUs" className='nav-link' >ABOUT-US</Nav.Link>
            {user.username ?  // if logged in
              <React.Fragment>
                {user.username == process.env.REACT_APP_ADMIN ?
                  <Nav.Link href='/Real-Estate/adminPanel' to="adminPanel" className='nav-link'>ADMIN-PANEL</Nav.Link> : //if admin
                  <Nav.Link href='/Real-Estate/applicationsList' to="applicationsList" className='nav-link'>MY-APPLICATIONS</Nav.Link> //if regular user
                }
                <Nav.Link href='/Real-Estate/profile' to="profile" className='nav-link'>PROFILE</Nav.Link>
              </React.Fragment>
              :
              <React.Fragment>
                <Nav.Link href='/Real-Estate/login' to="login" className='nav-link'>LOGIN</Nav.Link>
              </React.Fragment>
            }
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}
