import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.scss';

export default (props) => {

  // Vanta
  const [vantaEffect, setVantaEffect] = useState(0)
  const myRef = useRef(null)
  useEffect(() => {

    return () => {
      
    }
  }, [vantaEffect])

  return (
    <div className="page_container">
      <div className={styles.background}>




        
      </div>
    </div>

  );
}

