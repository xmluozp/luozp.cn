import React, { useState, useEffect } from 'react';
import styles from './AboutMe.module.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default (props) => {

    const [display, setDisplay] = useState(false);

    const handleDisplay = () => {

    }

    useEffect(() => {
       
      return () => {
        // if (canvas) canvas.destroy()
      }
    },[])


    return (

        <div className={`${styles.testColor} page_container`}>
            <div className="animation_title">This is about me title</div>
            about me
            <br />
            <img src={require('../../assets/images/testpictureForSize.jpg')}/>

            
               <CSSTransition
                    classNames="testanimation"
                    in = {display}
                    timeout={300}
                    appear={true}
 
                >
                <div className="test3d"> display {display?"true":"false"} </div>
            
                </CSSTransition>
         
                <button onClick={handleDisplay}>set display </button> 
        </div>
    );
}

