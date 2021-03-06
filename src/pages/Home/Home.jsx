import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { PageStage } from '../../context/store';
import styles from './Home.module.scss';
import SimpleTyping from '../../utils/SimpleTyping/SimpleTypeing';

export default withRouter(() => {

  const contextPageStage = useContext(PageStage);

  const [isEnd, setIsEnd] = useState(false)

  const textArray = [
    'Hey, System God! PLEASE spawn me a Front-en',
    'Hey, System God! PLEASE spawn me an experienced Programmer. Front-end preferate. Also master back-e',
    'Hey, System God! PLEASE spawn me an experienced Programmer. Just hurry!'
  ];
  // const textArray2 = [
  //   'WHAT THE HEL',
  //   'WHAT THE HECK ARE YOU DOING? FIND ME A PROGRAMMER',
  // ];


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
      <div className={[styles.background, contextPageStage.globalStage === 'ENTRANCE_LEAVING' ? styles.hide : styles.show].join(' ')}>
        {
          isEnd ?
            <div className={styles.respondPopup}>
              <SimpleTyping waitingTime={700} textArray={['SURE~~~~']} callBack={() => { }} isSendIcon={false} />
              <span className={styles.small}>[click my face to discover]</span>
            </div> : null
        }

        {/* a funny face bottom left */}
        <div className={styles.userFace}></div>
        <div className={styles.popup}>
          <SimpleTyping
            waitingTime={1000}
            textArray={textArray}
            callBack={() => {
              setTimeout(() => { setIsEnd(true); }, 1500)
            }}
            isSendIcon={true} />
        </div>


        <label className={styles.copyright}>Welcome to Zhaoping's website</label>

      </div>
    </div>

  );
})
