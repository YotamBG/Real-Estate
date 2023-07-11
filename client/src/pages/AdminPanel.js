import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export function AdminPanel() {
  const [applications, setApplications] = useState([]);

  const getApplications = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/applications/`, { credentials: 'include' });
      const jsonData = await response.json();
      setApplications(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <div style={{ paddingTop: 60 }}>
      <h1>Admin Panel</h1>
      <br /><br />
      {applications.length != 0 && <div className="applicationsContainer" >
        <table style={{ margin: 'auto', width: '100%' }}>
          <tr style={{ height: 70 }}>
            {(Object.entries(applications[0]).map(
              (entry) => !(['type', 'form', 'status'].includes(entry[0])) && // these shouldn't be dispalyed since they wouldn't fit or are irrelevant
                <th style={{ width: 150, height: 50, fontSize: 20, color: 'black' }}>{entry[0]}</th> //headings
            ))}
            <th style={{ fontSize: 20, color: 'black' }}>Details</th>
          </tr>
          {applications.map(
            (application, i) => <tr style={{ height: 100 }}>
              {(Object.entries(application).map(
                (entry) => (!(['type', 'form', 'status'].includes(entry[0])) &&
                  <td style={{ width: 150 }}>{String(entry[1])}</td>))) //data
              }
              <td style={{ width: 150 }}> {/* info button */}
                <Link to={`/applicationReview/${application.app_id}`} style={{ fontSize: 23, textDecoration: 'none' }} className='info'>ⓘ</Link>
              </td>
            </tr>
          )}
        </table>
      </div>}
    </div >
  );
}
