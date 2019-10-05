import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.scss';
import { Link, Route, withRouter } from 'react-router-dom';

export default (props) => {

  // Vanta
  const [vantaEffect, setVantaEffect] = useState(0)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        window.VANTA.BIRDS({
          el: myRef.current,
          backgroundColor: 0x4c7ebb,
          color1: 0x91d8ff,
          color2: 0x5669,
          colorMode: "lerp",
          birdSize: 1,
          wingSpan: 27.00,
          alignment: 100.00,
          quantity: 4.00,
          backgroundAlpha: 0.00,
        }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="page_container">
      <div ref={myRef} className={styles.background}></div>
    </div>

  );
}

