import React, { useEffect, useState } from 'react';
import useCancelableTimeout from "use-cancelable-timeout";


export default ({ children, delay }) => {

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

    return (<>
        {isLoad ? children: null}
    </>)
}