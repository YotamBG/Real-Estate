import { useEffect, useState } from "react";
import house from '../UI/background1.jpeg';

export function AboutUs({ user }) {
    // customizable positioning for the hero image:
    const [t, l, h, w] = [140, 720, 550, 450];

    return (
        <div className="AboutUs" style={{ paddingTop: 0 }}>
            <div className="homeBackground" ></div> {/* black background */}
            {(window.innerWidth > 480 && <>
                <div className="houseRadius" style={{ top: t - 10, left: l - 10, width: w + 20, height: h + 20 }}></div>
                <div className="houseOverlay" ></div>
                <img className="house" src={house} style={{ top: t, left: l, width: w, height: h }}></img>
            </>)}
            <div className="HomeInfoContainer" style={{ width: (window.innerWidth > 480 ? 580 : 340), left: (window.innerWidth > 480 ? 110 : 10) }}>
                <h1 style={{ fontWeight: 'bold', letterSpacing: '2px' }}>About Us</h1>
                <br />
                <p style={{ color: 'lightgray' }}>
                    We're cool
                </p>
                <br />
            </div>
        </div>
    );
}