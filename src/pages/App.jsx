import React, { Component, useState, useEffect } from 'react';
import styles from './App.module.scss';
import './App.scss';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import ReactLoading from 'react-loading';
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';
import AboutWebsite from './AboutWebsite/AboutWebsite';
import Blog from './Blog/Blog';
import TechStack from './TechStack/TechStack';
import Nav from '../components/Nav/Nav';


function App(props) {

  // only run once. hide the loader for the website
  if(document.getElementById('global_loader')){
  document.getElementById('global_loader').classList.add('global_loader_hide');
    setTimeout(() => {
      document.getElementById('global_loader')&& document.getElementById('global_loader').remove();
    }, 2000);
  }

  const [animationRotating, setAnimationRotating] = useState(false);
  const [navLocks, setNavLocks] = useState([]);

  const navLinks = [
    { title: "Home", to: "/" },
    { title: "Personal", to: "/aboutme" },
    { title: "Skill Sets", to: "/techstack" },
    { title: "Blog", to: "/blog" },
    { title: "About", to: "/aboutwebsite" },
  ];

  // ==============================handlers
  // have a lock list. in order to prevent messing up page animations when hitting nav items too quick
  const handleLockNav = (e) => {
    setAnimationRotating(true);
    // handle async of set state
    setNavLocks(prevState => {
      const currentLocks = prevState.slice();
      if (!currentLocks.includes(e.getAttribute('data-path'))) currentLocks.push(e.getAttribute('data-path'));
      return currentLocks;
    });
  }
 
  // check and unloack navs when animation over (from any pages)
  const handleUnlockNav = (e) => {

    const path = e.getAttribute('data-path');
    // handle async of set state
    setNavLocks(prevState => {
      return new Array(...prevState.filter((value) => {
        return value !== path;
      }))
    });
  }

  // ==============================effects
  useEffect(() => {

    
  }, [])
  useEffect(() => {

    // control lock of navs
    if (navLocks.length === 0 && animationRotating === true) {
      setAnimationRotating(false);
    }
  }, [navLocks])





  // Main JSX
  return (
    <>
      <Nav navLocks={navLocks} navLinks={navLinks} animationRotating={animationRotating}/>
      {/* section */}
      
      <section className={`z_main ${styles.main} ${animationRotating ? styles.main_lock : styles.main_unlock}`}>
        <AnimationRoute path="/" exact component={Home} onLock={handleLockNav} onUnlock={handleUnlockNav} />
        <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handleLockNav} onUnlock={handleUnlockNav} />
        <AnimationRoute path="/blog" exact component={Blog} onLock={handleLockNav} onUnlock={handleUnlockNav} />
        <AnimationRoute path="/techstack" exact component={TechStack} onLock={handleLockNav} onUnlock={handleUnlockNav} />
        <AnimationRoute path="/aboutwebsite" exact component={AboutWebsite} onLock={handleLockNav} onUnlock={handleUnlockNav} />
      </section>
    </>
  );
}

export default withRouter(App);

//---------------------------------Wrapper for animation

// test only:
const AnimationRouteTest = withRouter((props) => {

  const timeout = 2000;
  const clearup = () => {
    props.onCleanUp(timeout / 2);
  }

  return (
    <div className="test-sence">
      <div className="test-rotate1" data-path={props.path}>
        animation_cube_show {/*<Route {...props} /> */}
      </div>
      <div className="test-rotate2" data-path={props.path}>
        animation_cube_hide {/*<Route {...props} /> */}
      </div></div>
  );
})


// Animation for switch pages
const AnimationRoute = withRouter((props) => {

  const timeout = 800;


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
        onEntered={props.onUnlock}
        appear={true}
      >
        <div className={props.path} data-path={props.path}>
          <Route {...props} />
        </div>

      </CSSTransition>

    </TransitionGroup>
  );
})