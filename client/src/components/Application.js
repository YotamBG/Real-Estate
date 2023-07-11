import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';

const numToColor = (num) => { //used to give each card varying colors
  if (num % 5 == 0) {
    return '#8b8788';
  }
  if (num % 5 == 1) {
    return '#212121';
  }
  if (num % 5 == 2) {
    return '#f8c78c';
  }
  if (num % 5 == 3) {
    return '#e1dddc';
  }
  if (num % 5 == 4) {
    return '#b2a59f';
  }
};

export function Application({ user, Details, id }) {
  return (
    <>
      <Card style={{ backgroundColor: `${numToColor(id)}61` }}>
        <Card.Body>
          <Card.Title>Application ID: {Details.app_id}</Card.Title>
          <br />
          <Card.Text style={{fontWeight: 'bold'}}>Status: {Details.status_name}</Card.Text>
          <Card.Text>Date: {new Date(Details.date).toLocaleDateString("en-UK")}</Card.Text>
          {user.username == process.env.REACT_APP_ADMIN && <Card.Text>Username: {Details.username}</Card.Text>} {/*  in case the user=admin then all of the apps will be shown */}
          <Card.Text>Price: ${Details.price.toLocaleString("en-US")}</Card.Text>
          <br />
          <Link to={`/applicationDetails/${Details.app_id}`} className='btn' style={{padding: 10, width: 170, fontSize: 17}} >View Application</Link>
          <br /><br />
        </Card.Body>
      </Card>
    </>
  );
}