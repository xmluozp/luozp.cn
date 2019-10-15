import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { PageStage } from '../../context/store';
import styles from './Home.module.scss';
import SimpleTyping from '../../components/SimpleTyping/simpleTypeing';

export default withRouter(() => {

  const contextPageStage = useContext(PageStage);

  const [isEnd, setIsEnd] = useState(false)

  const textArray = [
    'Hey, Game Master! Spawn me a Front-en', 
    'Hey, Game Master! Spawn me a Programmer. Front-end preferate. Also master back-e',
    'Hey, Game Master! Spawn me a Programmer. Front-end preferate. Just hurry!'
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
            <span className={styles.small}>[click my face to discover]</span>
          </div>: null
        }

        <div className={styles.popup}>
            <SimpleTyping waitingTime={1000} textArray={textArray} callBack={()=>{ 
              setTimeout(()=>{setIsEnd(true); }, 2000)
              }} isSendIcon = {true}/>
          </div>
        

        <label className={styles.copyright}>Welcome to Zhaoping's Resume website</label>

      </div>
    </div>

  );
})
