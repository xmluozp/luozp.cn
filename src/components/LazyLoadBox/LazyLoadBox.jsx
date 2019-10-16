import React from 'react';
import LazyLoad from 'react-lazyload';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './LazyLoadBox.scss' // use general scss

export default (props) => {

    return (
        <LazyLoad {...props} height={512}>
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