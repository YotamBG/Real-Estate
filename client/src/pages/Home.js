import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import house from '../UI/background1.jpeg';

export function Home({ user }) {
    // reactive button, changing its prompt according to loggedin state 
    const [btnUrl, setBtnUrl] = useState({ url: '/productList', name: 'View our portfolio' });
    useEffect(() => {
        if (user.username) {
            setBtnUrl({ url: '/applicationsList', name: 'View my applications' });
        }
    }, [user]);

    // customizable positioning for the hero image:
    const [t, l, h, w] = [140, 720, 550, 450];


    return (
        <div className="Home" style={{ paddingTop: 0 }}>
            <div className="homeBackground" ></div> {/* black background */}
            {(window.innerWidth > 480 && <>
                <div className="houseRadius" style={{ top: t - 10, left: l - 10, width: w + 20, height: h + 20 }}></div>
                <div className="houseOverlay" ></div>
                <img className="house" src={house} style={{ top: t, left: l, width: w, height: h }}></img>
            </>)}
            <div className="HomeInfoContainer" style={{ width: (window.innerWidth > 480 ? 580 : 340), left: (window.innerWidth > 480 ? 110 : 10) }}>
                <h1 style={{ fontWeight: 'bold', letterSpacing: '2px' }}>Innovation,<br />Leadership,<br />Integrity.</h1>
                <br />
                <p style={{ color: 'lightgray' }}>
                    Graduate student housing in the northeast United States with a focus on highly ranked private universities with large graduate student populations and no on-campus student housing available.
                </p>
                <br />
                <Link className='btn mybtn houseButton' to={btnUrl.url}>
                    <p> {btnUrl.name}</p>
                </Link>
            </div>
        </div>
    );
}