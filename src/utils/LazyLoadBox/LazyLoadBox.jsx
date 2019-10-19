import React, {useEffect} from 'react';
import LazyLoad,  { forceCheck as LazyBoxForceCheck }  from 'react-lazyload';
import { CSSTransition } from 'react-transition-group';
import './LazyLoadBox.scss' // use general scss

const forceCheck = () => { LazyBoxForceCheck(); };

export default (props) => {

    useEffect(() => {
        LazyBoxForceCheck();
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

export {forceCheck};