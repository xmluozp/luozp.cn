import React, {useEffect, useRef} from 'react';
import styles from './TechStack.module.scss';

export default (props) => {

    const sceneRef = useRef(null);

    useEffect(() => {

        return () => {
            
        };
    }, [])



    return (
        <div className={`${styles.testColor} page_container`}>
            <div className="animation_title">This is about me title</div>
            <div id="scene" ref = {sceneRef}>
                    <div data-depth="0.2" style={{position:'absolute', left:"50px"}}>My first Layer!</div>
                    <div data-depth="0.6">My second Layer!</div>
            </div>
            tech stack0

            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>tech stack1
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>tech stack2
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>tech stack3
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>tech stack4
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>tech stack5
            <br/>
        </div>
    );
}

//===================