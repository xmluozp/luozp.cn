import React, {useEffect} from 'react';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import QueueLoader from '../../utils/QueueLoader/QueueLoader';
import styles from './TechStack.module.scss';

export default (props) => {


    const handleAllLoaded = () => {
       
    }

    useEffect(() => {

        return () => {
            
        };
    }, [])



    return (
        <div className={`${styles.testColor} page_container`}>
            <div className={styles.pageInnerContainer}>

            {/* <QueueLoader key="queueloader1" delay={1000} onAllLoaded={handleAllLoaded}>
                <LoadingBar title='React' key = "React"/>
                <LoadingBar title='HTML5' key = "HTML5"/>
                <LoadingBar title='CSS3' key ="CSS3"/>
            </QueueLoader> */}
            </div>
 
        </div>
    );
}

//===================