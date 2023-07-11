import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';

export function ApplicationDetails({ user }) {
  let { id } = useParams();
  const [application, setApplication] = useState({});
  const [disabled, setDisabled] = useState(false);
  const leasePic='https://eforms.com/images/2016/01/Standard-Residential-Lease-Agreement-Form.png';

  const getApplication = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/applications/${id}`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      setApplication(jsonData);
      const { img } = await getProduct(jsonData.Details.prop_id);
      setApplication(application => { return { ...application, img: img } });

      if (jsonData.Details.status > 5) {
        data2 = jsonData.Details.signature;
        final.current.fromDataURL(data2);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/products/${id}`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateStatus = async (status) => {
    try {
      const body = { "status": status };

      const response = fetch(process.env.REACT_APP_SERVER_URL + `/applications/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      setDisabled(true);
      getApplication();
      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getApplication();
  }, []);


  //pay
  const pay = async () => {
    // SETUP STRIPE
    setDisabled(true);
    fetch(process.env.REACT_APP_SERVER_URL + "/cart/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appId: application.Details.app_id, items: [{ 'product_id': 1, 'name': 'Insurance', 'price': 500, 'quantity': 1 }] }),
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
      })
      .then(({ url }) => {
        updateStatus(5);
        window.location = url;
      })
      .catch(e => {
        console.error(e.error)
      });
  }

  //sign
  let sigPad = useRef({});
  let final = useRef({});
  let data = ''; // new signature
  let data2 = ''; // retrived signature
  function clear() {
    sigPad.current.clear();
  }
  function save() {
    data = sigPad.current.toDataURL();
    const body = { "signature": data };

    const response = fetch(process.env.REACT_APP_SERVER_URL + `/applications/${id}/sign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: 'include'
    });
    updateStatus(6);
  }


  return (
    application.Details && (
      <div style={{ paddingTop: 50, paddingBottom: 60 }}>
        <div className="applicationDetailsContainer" style={{}}>
          <div style={{ width: '45%', textAlign: 'left' }}>
            <h1>Application Details</h1>
            <br />
            <h4 style={{ fontWeight: 'bold' }}>Status: {application.Details.status_name}</h4>
            <br />
            <p>Application ID: {application.Details.app_id}</p>
            <p>Date: {new Date(application.Details.date).toLocaleDateString("en-UK")}</p>
            <p>Price: ${application.Details.price.toLocaleString("en-US")}</p>
            <p>Prop ID: {application.Details.prop_id}</p>
            <br />
          </div >
          <div style={{ width: '45%' }}>
            <img src={application.img} className="propImg"></img>
          </div>
        </div>

        <br /><br /><br />

        {/* verify current user */}
        {user.username == application.Details.username && (<>

          {application.Details.status_name == 'Sign lease' && (<>

            {/* sign */}
            <h3>Sign lease:</h3>
            <div className={'signature'}>
              <img src={leasePic} style={{ width: '50%' }}></img>
              <div className="canvasContainer">
                <SignatureCanvas ref={sigPad} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
              </div>
              <br />
              <Button onClick={clear} className="sigBtn">Clear</Button>
              <Button onClick={save} className="sigBtn">Save</Button>


            </div></>)}

          {application.Details.status_name == 'Pay insurance' && (<>
            <h5>Please pay the insurance fee:</h5>
            <br />
            <Button disabled={disabled} onClick={() => { pay() }}  style={{width: 150, height: 50}}>Pay insurance</Button>

          </>)}


        </>)}

      </div>)
  );
}
