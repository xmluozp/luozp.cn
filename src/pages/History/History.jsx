import React, { useEffect, useState } from 'react';
import styles from './History.module.scss';
// import { LoremIpsum, Avatar } from 'react-lorem-ipsum';
import axios from 'axios';
import LazyLoad,  { forceCheck }  from 'react-lazyload';
import LazyLoadBox from '../../utils/LazyLoadBox/LazyLoadBox';


export default (props) => {

  const [dataWorkExp, setDataWorkExp] = useState(null)
  const [dataEduExp, setDataEduExp] = useState(null)

  useEffect(() => {
    async function fetchData() {

      const resultWork = await axios('./dataset/shortExperience.json');
      if (resultWork.status === 200) {
        setDataWorkExp(resultWork.data.dataset);
      }

      const resultEdu = await axios('./dataset/shortEducation.json');
      if (resultEdu.status === 200) {
        setDataEduExp(resultEdu.data.dataset);
      }
    }
    fetchData();

    return () => {};
  }, []);


  useEffect(() => {
    // console.log("forceCheck");
    // forceCheck();
  },[]);


  return (
    <div
      className={[
        "page_container",
        styles.conatiner
      ].join(' ')}>

{/* <button onClick={()=>{forceCheck();}}>force check</button> */}

      {/* wrapper of inner box */}
      <div className={styles.box}>


        {/* wrapper of category: education*/}
        <div className={styles.category}>
        
          <div className={styles.title}>
            <div className={styles.sticky}> WORK </div>
          </div>
          {/* wrapper of experiences */}
          <section className={styles.itemList}>
            {dataWorkExp && dataWorkExp.map((item, key)=> {
              return (
                <LazyLoadBox height={400} key={key}>
                  <ExperienceItem  dataSet={item}/>
                </LazyLoadBox>
              );
            })}
          </section>
        </div>

        {/* wrapper of category: work */}
        <div className={styles.category}>
          <div className={styles.title}>
            <div className={styles.stiky}>EDUCATION</div>

          </div>
          {/* wrapper of experiences */}
          <section className={styles.itemList}>
            {dataEduExp && dataEduExp.map((item, key)=> {
              return (
                <LazyLoadBox height={400} key={key}>
                  <ExperienceItem  dataSet={item}/>
                </LazyLoadBox>
              );
            })}
          </section>         
        </div>
        <div className={styles.theEnd}></div>
      </div>
    </div>
  );
}



const ExperienceItem = ({dataSet}) => {

  return (<div className={styles.item}>

    <div className={styles.itemTitle}>
      <span className={styles.position}>{dataSet.position}</span>
      <span className={styles.company}>{dataSet.org}, {dataSet.location}</span>
      <span className={styles.time}>{dataSet.time}</span>
    </div>

    <div className={styles.content}>
      <ul className={styles.content_l}>
        {
          dataSet.duty.map((item, key) => <li key={key}>{item}</li>)
        }
      </ul>
      {/* 
      <ul className={styles.content_r}>
      <li>
        <img src="/images/icons/icons8-scream-120.png" style={{ height: '128px', width: '128px' }} />
      </li>
      </ul> 
    */}
    </div>
  </div>)
}