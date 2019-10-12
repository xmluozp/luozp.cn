import React, { useState, useEffect } from 'react';
import styles from './AboutMe.module.scss';
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
        <LoremIpsum p={2} />
      </div>

<div className={styles.content}> hi hi hi</div>
      {/* <button onClick={handleDisplay}>test button</button> */}


      {/* 
            <img src={require('../../assets/images/testpictureForSize.jpg')}/> */}


      {/* <CSSTransition
                    classNames="testanimation"
                    in = {display}
                    timeout={300}
                    appear={true}
 
                >
                <div className="test3d"> display {display?"true":"false"} </div>
            
                </CSSTransition> */}


    </div>
  );
}

