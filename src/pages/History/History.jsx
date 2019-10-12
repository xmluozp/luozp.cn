import React, { useState, useEffect } from 'react';
import styles from './History.module.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LoremIpsum, Avatar } from 'react-lorem-ipsum';

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

