import React, { useEffect, useState } from 'react';
import useCancelableTimeout from "use-cancelable-timeout";
import './DelayLoader.scss';
import { CSSTransition } from 'react-transition-group';

export default ({ children, delay, fade }) => {

    const [isLoad, setIsLoad] = useState(false);


    const [onDelayStart, onDelayCancel] = useCancelableTimeout(
        () => {
            setIsLoad(true);
        },

        delay ? delay : 0,
    );

    useEffect(() => {
        onDelayStart();
        return () => {
            setIsLoad(false);
            onDelayCancel();
        };
    }, [])

    return isLoad ? renderChild(children, fade) : null;
    
}


const renderChild = ( renderChild, fade) => {


    return fade ? <CSSTransition
        classNames="delayLoad"
        in={true}
        timeout={300}
        appear={true}>
        {renderChild}
    </CSSTransition> : renderChild;
}