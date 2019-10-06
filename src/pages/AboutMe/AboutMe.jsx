import React, { useState } from 'react';
import styles from './AboutMe.module.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


export default (props) => {

    const [display, setDisplay] = useState(false);

    const handleDisplay = () => {

        setDisplay(!display);
    }

    return (

        <div className={`${styles.testColor} page_container`}>
            <div className="animation_title">This is about me title</div>
            about me
            <br />

            <button onClick={handleDisplay}>set display </button>

            

                <CSSTransition
                    classNames="testanimation"
                    in = {display}
                    timeout={300}
                    appear={true}
 
                >
                <div className="test3d"> display {display?"true":"false"} </div>

                </CSSTransition>
               
           
        </div>
    );
}

