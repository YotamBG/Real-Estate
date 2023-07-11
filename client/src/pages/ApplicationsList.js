import { useEffect, useState } from "react";
import { Application } from '../components/Application';

export function ApplicationsList({ user }) {
  const [applications, setapplications] = useState([]);

  const getapplications = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + `/applications/`, { credentials: 'include' });
      const jsonData = await response.json();
      setapplications(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getapplications();
  }, []);

  return (
    <div style={{ paddingTop: 60 }}>
      <h1>Applications</h1>
      <br />
      <div>
        {applications.map((application, i) =>
          <>
            <Application Details={application} id={i} key={i} user={user} />
            <br /><br />
          </>)}
      </div>
    </div >
  );
}
