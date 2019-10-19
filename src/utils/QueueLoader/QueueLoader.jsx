import React, {useState, useEffect} from 'react';
import useCancelableTimeout from 'use-cancelable-timeout';


/**
 *  a wrapper to make children inside loaded one by one
 */
export default ({ children, delay, onAllLoaded}) => {


    // render an array or an element
    const childrenItems = children.length > 0 ? children.map((item, index) => {
        return (
                <ChildrenItem key={item.props&&item.props.title?item.props.title:"queue" + index} delayStart={delay * index} delayDone={delay * (index + 1)} index={index} maxIndex={children.length - 1} onAllLoaded={onAllLoaded}>{item}</ChildrenItem>
            );
        }) : children;

    return (<>
        {childrenItems}
    </>)
}

/**
 *  set timeout directly instead of callBack will be better perform
 * @param {*} props 
 */
const ChildrenItem = (props) => {

    const {delayStart, delayDone, index, onAllLoaded, maxIndex} = props;
    const [status, setStatus] = useState("wait")

    const [onDelayStart, onDelayCancel] = useCancelableTimeout(
        () => {
            setStatus("start");
        },
        delayStart || 0,
    );

    const [onDoneStart, onDoneCancel] = useCancelableTimeout(
        () => {
            setStatus("done");
            if(index === maxIndex) {
                onAllLoaded();
            }           
        },
        delayDone || 0,
    );


    useEffect(() => {
        // the first one doesn't need delay

        onDelayStart();
        onDoneStart();

        return () => {
            onDelayCancel();
            onDoneCancel();
        };

    }, [])
    

    const newChild = React.cloneElement(props.children, {status: status})

    return (<>
            {newChild}
        </>
    );

}