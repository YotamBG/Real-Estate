import { useEffect, useState } from "react";
import { Product } from '../components/Product';


export function ProductList() {
  const [products, setProducts] = useState([]);


  const getProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/products`, { credentials: 'include' });
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {(products.length == 0 ? <div style={{ width: '100%' }}><br /><p>Loading...</p></div> : <div style={{ width: '100%' }}>
        <div className="productsContainer">
          <div style={{ color: '#616b7d' }}>
            <h1 style={{ color: '#294169' }}>PORTFOLIO</h1>
            <br />
            <p>
              Avance Capital, LLC and our affiliates currently manage more than 35 buildings with 60 apartments and 270 beds.
            </p>
            <p>
              Properties in the Avance portfolio have the look and feel of luxury apartments 
              <br />with granite counters and stainless-steel appliances without superfluous amenities like a doorman or a gym.
            </p>
          </div>
          <div className="productsListContainer" style={{ gridTemplateColumns: `repeat(${window.innerWidth > 480 ? 3 : 1}, 1fr)`}}>
            {products.map((product, i) =>
              <Product product={product} />)}
          </div>
        </div >
      </div>)}
    </div>
  );
}