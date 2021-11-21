import React, { useEffect } from 'react';
import styles from './AboutMe.module.scss';
import { isBrowser } from 'react-device-detect';
import { Link } from 'react-router-dom';
// import LazyLoadBox,  { forceCheck }  from '../../components/LazyLoadBox/LazyLoadBox'
import Social from '../../components/Social/Social';
import DelayLoader from '../../utils/DelayLoader/DelayLoader';

// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { LoremIpsum, Avatar } from 'react-lorem-ipsum';

export default (props) => {

  useEffect(() => {
    // forceCheck();
    return () => {
      // if (canvas) canvas.destroy()
    }
  }, [])


  return (
    // don't set padding or margin here. this is a styleing box
    <div
      className={[
        "page_container",
        styles.conatiner
      ].join(' ')}>

      <div className={styles.pageInnerContainer}>
        <div className={styles.floating}>
          <div className={styles.floating_l}>
          <DelayLoader delay={1000} fade={true}>
            <div className={styles.picture}>
                <img src='./images/myself.png' alt='Zhaoping Luo'/>
            </div>
            </DelayLoader>
          </div>
          <div className={styles.floating_r}>
            {isBrowser ? <div className={styles.annoyingTalk}>
              Let me fetch some data... Hah. <b>Who</b> is this Zhaoping guy in my list? Let’s see if it worth it to <b>INSTANTIATE</b>!!
              {/* ... db.npcElite.find( {'{'}name: Zhao... */}
            </div> : null}
            <div className={styles.myName}>
              Zhaoping Luo
            </div>
            <div className={styles.myTitle}>
              Web Developer / Programmer
            </div>



            <div className={styles.popup}>
              <p>I am a programmer who has over 5 years of web development experience, skilled in both front-end and back-end.
                 <br />(<Link to="/history">My past experience</Link> and <Link to="/techstack">My skill set</Link> )</p>
              <p>In the year 2015, I immigrated to Canada. Then I went back to school, Red River College, Winnipeg. Besides a certificate, This journey also kept my programming knowledge up-to-date, as well as learning about modern software industry programming standards (Agile, Git, Docker, Es-lint, Linux. etc.).</p>
              <p>The website is built for a job. Thanks for it now I <Link to="/history">had a job</Link>.</p>
              <div className={styles.mySocial}>
                <Social />
              </div>
            </div>
          </div>
        </div>


        <div className={styles.theEnd}></div>

      </div>
    </div>
  );
}

