import React, {useEffect} from 'react';
import LazyLoad,  { forceCheck }  from 'react-lazyload';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './LazyLoadBox.scss' // use general scss

export default (props) => {

    useEffect(() => {
        forceCheck();
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