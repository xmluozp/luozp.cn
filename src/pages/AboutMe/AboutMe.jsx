import React, { useEffect } from 'react';
import styles from './AboutMe.module.scss';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';

// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { LoremIpsum, Avatar } from 'react-lorem-ipsum';

export default (props) => {

  useEffect(() => {

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
              <p>"Catching new tech is painful." Years ago, I used to believe.</p>
              <p>Whenever a new tech came out, I thought: "Wat? My stuff is becoming garbage again?". </p>
              <p>Now I've changed my mind.</p>
              <p>New programming tech is usually an elegant and better version of old ones. That's why people want to replace what they've already mastered.</p>
              <p>Now I enjoy it.</p>
              <div className={styles.mySocial}>
                <a href="https://github.com/xmluozp" target="_blank" title="GitHub of Zhaoping Luo"><GitHubIcon/></a>
                <a href="https://www.linkedin.com/in/zhaopingluo/" target="_blank" title="LinkedIn of Zhaoping Luo"><LinkedInIcon/></a>
                <a href="https://www.facebook.com/luo.zhaoping" target="_blank" title="FaceBook of Zhaoping Luo"><FacebookIcon/></a>
            </div>
            </div>
          </div>

        </div>


        {/* <button onClick={handleDisplay}>test button</button> */}
        {/* 
            <img src={require('../../assets/images/testpictureForSize.jpg')}/> */}
        {/* <CSSTransition
                    classNames="testanimation"
                    in = {display}
                    timeout={300}
                    appear={true}
                >
                <div className="test3d"> display {display?"true":"false"} </div></CSSTransition> */}
      </div>
    </div>
  );
}

