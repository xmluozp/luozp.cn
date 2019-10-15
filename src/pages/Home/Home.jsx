import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { PageStage } from '../../context/store';
import styles from './Home.module.scss';
import SimpleTyping from '../../components/SimpleTyping/simpleTypeing';

export default withRouter((props) => {

  const contextPageStage = useContext(PageStage);

  const [isEnd, setIsEnd] = useState(false)

  const textArray = [
    'Hey, Admin! Spawn me a Front-en', 
    'Hey, Admin! Spawn me a Programmer. Front-end preferate. Also master back-end such as PHP, SQL.',
    'Hey, Admin! Spawn me a Programmer. Front-end preferate. Also master back-end such as PHP, Sql, non-Sql...etc. Fast learner. Has a cat.',
    'Hey, Admin! Spawn me a Programmer. Front-end preferate. Also master back-end such as PHP, Sql, non-Sql...etc. Fast learner.... Hurry!'
  ];
  const textArray2 = [
    'WHAT THE HEL',
    'WHAT THE HECK ARE YOU DOING? FIND ME A PROGRAMMER',
  ];

  useEffect(() => {
    contextPageStage.globalStage = 'ENTRANCE';
    return () => {
      
    }
  }, [])

  useEffect(() => {
    console.log("hide or show?", contextPageStage.globalStage);
    return () => {
      
    }
  }, [contextPageStage.globalStage])

  return (
    <div className="page_container">
      <div className={[styles.background, contextPageStage.globalStage === 'ENTRANCE_LEAVING'? styles.hide: styles.show].join(' ')}>
        {
          isEnd?
          <div className={styles.respondPopup}>
            <SimpleTyping waitingTime={1000} textArray={['SURE~~~~']} callBack={()=>{}} isSendIcon = {false}/>
            <span className={styles.small}>[click my face]</span>
          </div>: null
        }

        <div className={styles.popup}>
            <SimpleTyping waitingTime={1000} textArray={textArray} callBack={()=>{ setIsEnd(true); }} isSendIcon = {true}/>
          </div>
        

        <label className={styles.copyright}>Welcome to Zhaoping's Resume website</label>

      </div>
    </div>

  );
})
