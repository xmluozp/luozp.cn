import React, { useState } from 'react';
import styles from './App.module.scss';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';
import AboutWebsite from './AboutWebsite/AboutWebsite';
import Blog from './Blog/Blog';
import TechStack from './TechStack/TechStack';
import Nav from '../components/Nav/Nav';


function App(props) {

  const [routeAnimationFinished, setRouteAnimationFinished] = useState(true);
  const [navLocks, setNavLocks] = useState([]);
  const navLinks = [
    {title: "Home", to: "/"},
    {title: "About Me", to: "/aboutme"},
    {title: "Blog", to: "/blog"},
    {title: "Tech Stack", to: "/techstack"},
    {title: "About Website", to: "/aboutwebsite"},
  ];


  let timeoutCleanup;

  // have a lock list. in order to prevent messing up page animations when hitting nav items too quick
  const handleLockNav = (e) => {

    setRouteAnimationFinished(false);
    const currentLocks = navLocks.slice();
    if (!currentLocks.includes(e.getAttribute('data-path'))) currentLocks.push(e.getAttribute('data-path'));
    setNavLocks(currentLocks);
  }
  const handleUnlockNav = (e) => {
    setNavLocks([]);
  }
  const handleCleanUp = (timeout) => {
    clearTimeout(timeoutCleanup);
    setTimeout(() => {
      timeoutCleanup = setRouteAnimationFinished(true);
    }, timeout / 2);
  }




  // Main JSX
  return (
    <>
      <Nav navLocks={navLocks} navLinks={navLinks}/>
      {/* section */}
      <section className={`z_main ${styles.main} ${routeAnimationFinished ? styles.main_unlock : styles.main_lock}`}>
        <AnimationRoute path="/" exact component={Home} onLock={handleLockNav} onUnlock={handleUnlockNav} onCleanUp={handleCleanUp} />
        <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handleLockNav} onUnlock={handleUnlockNav} onCleanUp={handleCleanUp} />
        <AnimationRoute path="/blog" exact component={Blog} onLock={handleLockNav} onUnlock={handleUnlockNav} onCleanUp={handleCleanUp} />
        <AnimationRoute path="/techstack" exact component={TechStack} onLock={handleLockNav} onUnlock={handleUnlockNav} onCleanUp={handleCleanUp} />
        <AnimationRoute path="/aboutwebsite" exact component={AboutWebsite} onLock={handleLockNav} onUnlock={handleUnlockNav} onCleanUp={handleCleanUp} />
      </section>
    </>
  );
}

export default withRouter(App);



//---------------------------------Wrapper for animation
// Animation for switch pages
const AnimationRoute = withRouter((props) => {

  const timeout = 500;

  const clearup = () => {
    props.onCleanUp(timeout / 2);
  }

  return (
    <TransitionGroup>
      <CSSTransition
        classNames="slide-in"
        timeout={timeout}
        key={props.location.pathname}
        unmountOnExit
        onExit={props.onLock}
        onExited={props.onUnlock}
        onEnter={props.onLock}
        onEntered={(e) => { props.onUnlock(e); clearup() }}
        appear={true}
      >
        <div className={props.location.pathname} data-path={props.location.pathname}>
          <Route {...props} />
        </div>

      </CSSTransition>
    </TransitionGroup >
  );
})

