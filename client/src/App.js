import './App.css';
import { } from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { NavBar } from './components/NavBar';
import { ProductList } from './pages/ProductList';
import { Profile } from './pages/Profile';
import { ApplicationsList } from './pages/ApplicationsList';
import { ApplicationDetails } from './pages/ApplicationDetails';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { Register } from './pages/Register';
import { IntialForm } from './pages/IntialForm';
import { Login } from './pages/Login';
import { ProductUpload } from './pages/ProductUpload';
import { ProductDetails } from './pages/ProductDetails';
import { useEffect, useState } from "react";
import { ApplicationReview } from './pages/ApplicationReview';
import { AdminPanel } from './pages/AdminPanel';


function App() {
  const [user, setUser] = useState({});  

  const getUser = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+"/users/profile", { credentials: 'include' });
      const jsonData = await response.json();
      if (response.status == 200) {
        setUser(jsonData.user);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="App" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', overflow: 'hidden' }}>
      <BrowserRouter basename={'/Real-Estate'}>
        <NavBar user={user} />        
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="aboutUs" element={<AboutUs user={user} />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="profile" element={<Profile user={user}/>} />
          <Route path="applicationsList" element={<ApplicationsList user={user}/>} />
          <Route path="adminPanel" element={<AdminPanel user={user}/>} />
          <Route path="register" element={<Register />} />
          <Route path="intialForm/:id" element={<IntialForm user={user}/>} />
          <Route path="login" element={<Login />} />
          <Route path="productUpload" element={<ProductUpload />} />
          <Route path="productDetails/:id" element={<ProductDetails user={user} />} />
          <Route path="applicationDetails/:id" element={<ApplicationDetails user={user} />} />
          <Route path="applicationReview/:id" element={<ApplicationReview user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
