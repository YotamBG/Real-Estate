import { Button } from 'react-bootstrap';
import { AvatarGenerator } from 'random-avatar-generator';

export function Profile({ user }) {

  const generator = new AvatarGenerator();
  const avatar = generator.generateRandomAvatar(user.username);

  const logout = async () => {
    try {

      const response = await fetch(process.env.REACT_APP_SERVER_URL + "/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });

      window.location = "/Real-Estate";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ paddingTop: 60 }}>
      <h1 style={{}}>Profile</h1>
      <br />
      {user.img ?
        <img src={user.img} style={{ width: (window.innerWidth > 480 ? '20%' : '80%'), boxShadow: '0px 15px 15px' }} /> :
        user.username && <img src={avatar}></img>
      }
      <br /><br />
      <h4 style={{}}>{user.username}</h4>
      <br />
      <Button className="Button" variant="danger" onClick={() => { logout() }}>Logout</Button>
    </div>
  );
}