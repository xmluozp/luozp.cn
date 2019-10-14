import React, { useEffect } from 'react';
import styles from './History.module.scss';

export default (props) => {

  useEffect(() => {

    return () => {
      // if (canvas) canvas.destroy()
    }
  }, [])


  return (
    <div
      className={[
        "page_container",
        styles.conatiner
      ].join(' ')}>
      <div className={styles.popup}>
        Work history
        {/* <LoremIpsum p={5} /> */}
      </div>


    </div>
  );
}

