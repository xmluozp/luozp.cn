import React, {useEffect} from 'react';
import LazyLoad from 'react-lazyload';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './LazyLoadBox.scss' // use general scss
import { forceCheck } from 'react-lazyload';

export default (props) => {

    useEffect(() => {
        forceCheck();
        console.log("check");
        return () => {

        };
    }, [])

    return (
        <LazyLoad {...props}>
            <CSSTransition
                    classNames="lazyLoad"
                    in = {true}
                    timeout={800}
                    appear={true}>         
                {props.children}
            </CSSTransition>
        </LazyLoad>
    )
}