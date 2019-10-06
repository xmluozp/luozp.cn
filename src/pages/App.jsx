import React, { useState } from 'react';
import styles from './App.module.scss';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';
import AboutWebsite from './AboutMe/AboutMe';
import Blog from './AboutMe/AboutMe';
import TechStack from './TechStack/TechStack';


function App(props) {

  const { location } = props;
  const [routeAnimationFinished, setRouteAnimationFinished] = useState(true);
  const [navLocks, setNavLocks] = useState([]);
  const [navDisplayItems, setNavDisplayItems] = useState(true);
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

  // 
  const handleCleanUp = (timeout) => {
    clearTimeout(timeoutCleanup);
    setTimeout(() => {
      timeoutCleanup = setRouteAnimationFinished(true);
    }, timeout / 2);
  }

  // mobile only: toggle menu
  const handleToggleMenu = (e) => {
    if (location.pathname !== '/') {
      setNavDisplayItems(!navDisplayItems);
      e.preventDefault();
    }
    else {
      // on mobile, set the default nav display: true
      // setNavDisplayItems(false);
    }
  }


  // Main JSX
  return (
    <>
      {/* header */}
      <BrowserView>
        {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
        <header className={`${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_side}`}>
          <div className={styles.animation_menu}>
            {/* if its entrance, hit the avatar will go to: [about me] */}
            <AnimationLink to={location.pathname === '/' ? "/aboutme" : "/"} lock={navLocks} >
              <div className={styles.avatar}></div>
            </AnimationLink>

            <NavItems navLocks={navLocks} />

          </div>
        </header>
      </BrowserView>

      <MobileView>
        {/* check if display icon as the avatar(entrance) or a mobile nav(inner pages) */}
        <header className={`${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_mobileside}`}>

          {/* if its inner pages, hit the avatar will display the nav*/}
          <Link to="/aboutme" onClick={handleToggleMenu}>
            <div className={styles.avatar}></div>
          </Link>

          {/* display the nav */}
          <div className={navDisplayItems ? styles.navitems_display : styles.navitems_hide}>
            <NavItems navLocks={navLocks} />
          </div>
        </header>
      </MobileView>


      {/* section */}
      <section className={`${styles.main} ${routeAnimationFinished ? styles.main_unlock : styles.main_lock}`}>
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

//---------------------------------Wrapper for nav links
const NavItems = withRouter((props) => {
  const { navLocks } = props
  return (
    <div className={styles.navitems}>
      <ul>
        <li>
          <AnimationLink to="/" lock={navLocks} >
            HOME
                </AnimationLink>
        </li>
        <li>
          <AnimationLink to="/aboutme" lock={navLocks} >
            About Me
                </AnimationLink>
        </li>
        <li>
          <AnimationLink to="/blog" lock={navLocks} >
            Blog
                </AnimationLink>
        </li>
        <li>
          <AnimationLink to="/techstack" lock={navLocks} >
            Tech Stack
                </AnimationLink>
        </li>
        <li>
          <AnimationLink to="/aboutwebsite" lock={navLocks} >
            About Website
                </AnimationLink>
        </li>
      </ul>
    </div>
  )
})

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
        onEntered={(e)=>{props.onUnlock(e); clearup()}}
        appear={true}
      >
        <div className={props.location.pathname} data-path={props.location.pathname}>
        <Route {...props} />
      </div>

      </CSSTransition>
    </TransitionGroup >
  );
})

// Animation for link when switching pages
const AnimationLink = withRouter((props) => {
  const { to, lock, onClick } = props;

  // lock the nav <a> when playing animation
  const handleClick = (e) => {
    if (lock && lock.includes(to)) e.preventDefault();
  }

  return (
    <Link to={to} onClick={handleClick} className={lock && lock.includes(to) || props.location.pathname === to ? styles.linkselected : styles.linkregular}>
      {props.children}
    </Link>
  )
})