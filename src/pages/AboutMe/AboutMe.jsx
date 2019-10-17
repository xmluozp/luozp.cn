import React, { useEffect } from 'react';
import styles from './AboutMe.module.scss';
import { isMobileOnly, isBrowser } from 'react-device-detect';
// import LazyLoadBox,  { forceCheck }  from '../../components/LazyLoadBox/LazyLoadBox'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';

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

              <div className={styles.picture}>
                <img src='./images/myself.png' alt='picture of zhaoping luo' />
              </div>


          </div>
          <div className={styles.floating_r}>

            <div className={styles.myName}>
              Zhaoping Luo
            </div>
            <div className={styles.myTitle}>
              Web Developer / Programmer
            </div>



            <div className={styles.popup}>
            {isBrowser? <div className={styles.annoyingTalk}>  
              Hah.  <b>What</b> is this Zhaoping? Let’s see if it is worth to <b>INSTANTIATE</b>!! ...... db.npcElite.find( {'{'}name...;
            </div> : null }
              <p>I am a web developer who has over 5 years of web development experience, skilled in both front-end and back-end.</p>
              <p>In the year 2015, I immigrated to Canada. Then I went back to school, Red River College, Winnipeg. Besides a certificate, It kept my programming knowledge up-to-date, as well as modern software industry programming standards (Agile, Git, Docker, Es-lint, Linux..etc).</p>
              <p>Recently, I graduated.</p>
              <p>It's time to get a job.</p>
              <div className={styles.mySocial}>
                <a href="https://github.com/xmluozp" target="_blank" title="GitHub of Zhaoping Luo"><GitHubIcon /></a>
                <a href="https://www.linkedin.com/in/zhaopingluo/" target="_blank" title="LinkedIn of Zhaoping Luo"><LinkedInIcon /></a>
                <a href="https://www.facebook.com/luo.zhaoping" target="_blank" title="FaceBook of Zhaoping Luo"><FacebookIcon /></a>
              </div>
            </div>
          </div>
        </div>


        <div className={styles.theEnd}></div>
                
      </div>
    </div>
  );
}

