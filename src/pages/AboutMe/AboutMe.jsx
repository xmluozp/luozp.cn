import React, { useState, useEffect } from 'react';
import styles from './AboutMe.module.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {load, unload, imgSwitch} from '../../utils/flashicons';


export default (props) => {

    const [display, setDisplay] = useState(false);

    const handleDisplay = () => {

        setDisplay(!display);
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

            {/* <button onClick={handleDisplay}>set display </button> */}
                {/* <CSSTransition
                    classNames="testanimation"
                    in = {display}
                    timeout={300}
                    appear={true}
 
                > */}
                {/* <div className="test3d"> display {display?"true":"false"} </div> */}

                {/* </CSSTransition> */}
                {/* <button onClick={()=>{load();}}>re-render</button> */}
                <button onClick={()=>{load("c");}}>remove</button>
                <button onClick={()=>{unload("c");}}>remove</button>
                <button onClick={()=>{imgSwitch(2);}}>select</button>


                <canvas id="c"></canvas>
        </div>
    );
}

