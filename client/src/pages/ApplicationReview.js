import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
//sign
import SignatureCanvas from 'react-signature-canvas';

export function ApplicationReview({ user }) {
  let { id } = useParams();
  const [application, setapplication] = useState({});
  const [disabled, setDisabled] = useState(false);
  const getapplication = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/applications/${id}`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      setapplication(jsonData);
      const { img } = await getProduct(jsonData.Details.prop_id);
      setapplication(application => { return { ...application, img: img } });

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
      getapplication();
      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getapplication();
  }, []);

  //sign
  let final = useRef({});
  let data2 = ''; // retrived sig

  let sigPad = useRef({});
  let data = ''; // new sig

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
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: 50 }}>
          <div style={{ width: '45%', textAlign: 'left' }}>
            <h1>Application Review</h1>
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

        {user.username == process.env.REACT_APP_ADMIN &&
          <><h1>Forms:</h1>
            <br />
            <div style={{ border: '2px solid lightGray', borderRadius: 5, width: '40%', margin: 'auto', padding: 20 }}>
              <h3>Intial Form</h3>
              <br />
              {
                <>
                  {Object.entries(application.Details.form).map(entry => <><h5>{entry[0]}</h5><p>{entry[1]}</p></>)}
                  <h5>approved:</h5>{(application.Details.approved == 1 ? 'true' : 'false')}
                </>
              }
              <br /><br />
              {!application.Details.approved && <>
                <Button className="Button" disabled={disabled} onClick={() => { updateStatus(2); alert('Submitted!') }}>Approve</Button>
                <br />
                <br />
                <Button className="Button" disabled={disabled} onClick={() => { updateStatus(-1); alert('Submitted!') }}>Deny</Button></>}
            </div>

            <br /><br /><br />
            <h1>Background checks:</h1>
            <br />
            <div style={{ border: '2px solid lightGray', borderRadius: 5, width: '40%', margin: 'auto', padding: 20 }}>
              <h3>Credit score</h3>
              <br />
              <p>Status: {(application.background_checks.rows[0].resolved ? 'done' : 'pending...')}</p>
              {application.background_checks.rows[0].resolved &&
                <p>Credit score: {application.background_checks.rows[0].response.data.models[1].score}</p>
              }
              <br />
            </div>
            <br /><br />
            <div style={{ border: '2px solid lightGray', borderRadius: 5, width: '40%', margin: 'auto', padding: 20 }}>
              <h3>Criminal background</h3>
              <br />
              <p>Status: {(application.background_checks.rows[1].resolved ? 'done' : 'pending...')}</p>
              {application.background_checks.rows[1].resolved &&
                <p>Number of offenses: {application.background_checks.rows[1].response.cicCriminal.candidates.candidate[1].offenses.count}</p>
              }
              <br />
            </div>
            {application.Details.status > 5 && <>
              <br /><br /><br />
              <h1>Signed lease:</h1>
              <img src='https://eforms.com/images/2016/01/Standard-Residential-Lease-Agreement-Form.png' style={{ width: '50%' }}></img>
              <div style={{ border: '2px solid lightGray', padding: 0, width: 500, height: 100, margin: 'auto' }}>
                <SignatureCanvas ref={final} canvasProps={{ width: 900, height: 200, className: 'sigCanvas' }} />
              </div>
            </>}
          </>}
      </div>)
  );
}
