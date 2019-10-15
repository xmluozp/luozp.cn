import React, { useEffect } from 'react';
import styles from './AboutMe.module.scss';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { LoremIpsum, Avatar } from 'react-lorem-ipsum';

export default (props) => {

  useEffect(() => {

    return () => {
      // if (canvas) canvas.destroy()
    }
  }, [])


  return (
    // don't set padding or margin here. this is a styleing box
    <div
      className={[
        "page_container",
        styles.conatiner
      ].join(' ')}>  


      <div className = {styles.pageInnerContainer}>
      <div className={styles.popup}>
        <p>"Catching new tech is painful." Years ago, I used to believe.</p>
        <p>Whenever a new tech came out, I thought: "Wat? My stuff is becoming garbage again?". </p>
        <p>Now I've changed my mind.</p>
        <p>New programming tech is usually an elegant and better version of old ones. That's why people want to replace what they've already mastered.</p>
        <p>Now I enjoy it.</p>
      </div>

   
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
    </div>
  );
}

