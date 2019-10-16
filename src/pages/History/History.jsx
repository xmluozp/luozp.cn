import React, { useEffect } from 'react';
import styles from './History.module.scss';
// import { LoremIpsum, Avatar } from 'react-lorem-ipsum';
import LazyLoadBox from '../../components/LazyLoadBox/LazyLoadBox';

export default (props) => {

  useEffect(() => {

    return () => {
      // if (canvas) canvas.destroy()
    }
  }, [])

  console.log('render');
  return (
    <div
      className={[
        "page_container",
        styles.conatiner
      ].join(' ')}>

      <label>/* Coder's law: Of course. everything in curly braces should be noticable. (and this satement itself will be invisible.) */</label>
      {/* wrapper of inner box */}
      <div className={styles.box}>

        {/* wrapper of category: education or work */}
        <div className={styles.category}>
          <div className={styles.title}>Education</div>
          {/* wrapper of experiences */}
          <section className={styles.itemList}>
            <div className={styles.item}>

              <div className={styles.itemTitle}>
                <span className={styles.position}>Front-End Developer</span>
                <span className={styles.company}>Tintop Technology, China</span>
                <span className={styles.time}> 2018 – Present</span>
              </div>

              <div className={styles.content}>
                <ul className={styles.content_l}>
                  <li>JQuery, Bootstrap, HTML, CSS, SVN, Visual Studio Code</li>
                  <li>Built a mobile website which provides tourism-related services.</li>
                </ul>
                {/* <ul className={styles.content_r}>
                  <li><img src="/images/icons/icons8-scream-120.png" style={{ height: '128px', width: '128px' }} />
                  </li>
                </ul> */}
              </div>

            </div>
          </section>
        </div>

      </div>
      <div style={{ height: '1000px' }}></div>

      {/* <LazyLoadBox height={512}>
        <img src="/images/icons/shield.png" /> 
      </LazyLoadBox> */}

    </div>
  );
}

