import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';


export function ProductDetails() {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [disabled, setDisabled] = useState(false);

  const getProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/products/${id}`, { credentials: 'include' });
      const jsonData = await response.json();
      setProduct(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addProduct = async () => {  //change name
    try {
      setDisabled(true);
      window.location = `/Real-Estate/IntialForm/${id}`;
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProduct();
    window.scrollTo(0, 0);
  }, []);

  return (
    product.price && (
      <div className='productDetailsContainer'>
        <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
          {product.img && <img src={product.img} className="propImg" />}
        </div>
        <div style={{ textAlign: 'left', margin: 0, width: '45%' }}>
          <br /><br />
          <h1>Property Details</h1>
          <br />
          <h2>{product.name}</h2>
          <br /><br /><br />
          <p>{product.description}</p>
          <p>Price: ${product.price.toLocaleString("en-US")}</p>
          <br /><br />
          <Button variant="success" disabled={disabled} style={{ padding: 10, width: 200, fontSize: 17 }} onClick={() => { addProduct() }}>Submit application</Button>
        </div>
      </div>)
  );
}
