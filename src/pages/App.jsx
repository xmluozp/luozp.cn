import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import './App.scss';
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
    { title: "Home", to: "/" },
    { title: "Skill Sets", to: "/techstack" },
    { title: "Personal", to: "/aboutme" },
    { title: "Blog", to: "/blog" },
    { title: "About", to: "/aboutwebsite" },
  ];

  // have a lock list. in order to prevent messing up page animations when hitting nav items too quick
  const handleLockNav = (e) => {

    setRouteAnimationFinished(false);
    // handle async of set state
    setNavLocks(prevState => {
      const currentLocks = prevState.slice();
      if (!currentLocks.includes(e.getAttribute('data-path'))) currentLocks.push(e.getAttribute('data-path'));
      return currentLocks;
    });
  }
  const handleUnlockNav = (e) => {

    const path = e.getAttribute('data-path');

    // handle async of set state
    setNavLocks(prevState => {
      return new Array(...prevState.filter((value) => {
        return value !== path;
      }))
    });
  }
  const handleCleanUp = (timeout) => {


  }
  useEffect(()=>{ 
    if(navLocks.length === 0 && routeAnimationFinished === false){
      setRouteAnimationFinished(true);
    }
   }, [navLocks])


  // Main JSX
  return (
    <>
      <Nav navLocks={navLocks} navLinks={navLinks} />
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
const AnimationRouteTest = withRouter((props) => {

  const timeout = 2000;

  const clearup = () => {
    props.onCleanUp(timeout / 2);
  }

  return (

    <div className="slide-in-exit-active" data-path={props.path}>
      <Route {...props} />




      {/* <CSSTransition
          classNames="slide-in"
          timeout={timeout}
          in={props.location.pathname === props.path}
          unmountOnExit
          onExit={props.onLock}
          onExited={props.onUnlock}
          onEnter={props.onLock}
          onEntered={(e) => { props.onUnlock(e); clearup() }}
          appear={true}
        >
          <div className={props.path} data-path={props.path}>
            <Route {...props} />
          </div>

        </CSSTransition> */}
    </div>

  );
})


// Animation for switch pages
const AnimationRoute = withRouter((props) => {

  const timeout = 500;

  const clearup = () => {
    props.onCleanUp(timeout * 1.5);
  }

  // "Transition group" because we want to temporary keep the page while its exiting.
  // here is "key" attribute, CSSTransition is "in" attribute
  return (
    <TransitionGroup>
      <CSSTransition
        classNames="slide-in"
        timeout={timeout}
        key={props.location.pathname === props.path}

        onExit={props.onLock}
        onExited={props.onUnlock}
        onEnter={props.onLock}
        onEntered={(e) => { props.onUnlock(e); clearup() }}


        appear={true}
      >
        <div className={props.path} data-path={props.path}>
          <Route {...props} />
        </div>

      </CSSTransition>

    </TransitionGroup>
  );
})