export function Product({ product }) {
  return (
    <a href={`/Real-Estate/productDetails/${product.product_id}`} style={{ color: 'black', textDecoration: 'none' }}>
      <div className="container pimg">
        <img src={product.img} style={{ width: '100%', borderRadius: 10 }}></img>
        <br /><br />
        <nobr style={{ color: '#f2aa6f', fontSize: 22 }}>$</nobr><nobr style={{ color: '#616b7d', fontSize: 22 }}>{product.price.toLocaleString("en-US")}</nobr> {/* price */}
        <p style={{ color: '#294169', fontSize: 22 }}>{product.name.split(' ').slice(1, 3).join(' ')}</p> {/* street */}
        <p>{product.name.split(' ').slice(4, 6).join(' ')}</p> {/* zip code */}
      </div>
    </a>
  );
}