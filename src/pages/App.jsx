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
  const [navLocks, setNavLocks] = useState([]);
  const [navDisplayItems, setNavDisplayItems] = useState(false);

  const handleLockNav = (e) => {
    const currentLocks = navLocks.slice();
    if (!currentLocks.includes(e.getAttribute('data-path'))) currentLocks.push(e.getAttribute('data-path'));
    setNavLocks(currentLocks);
  }
  const handleUnlockNav = (e) => {
    let currentLocks = navLocks.slice();
    // currentLocks = currentLocks.filter(v=>v!==e.getAttribute('data-path'));
    setNavLocks([]);
  }
  const handleToggleMenu = (e) =>{
    if (location.pathname !== '/')
     {
       setNavDisplayItems(!navDisplayItems);
       e.preventDefault(); 
     }
     else{
      setNavDisplayItems(false);
     }
  }


  // Main JSX
  return (
    <>
      {/* header */}
      <BrowserView>
        <header className={`${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_side}`}>
          <div className={styles.animation_menu}>
            <AnimationLink to={location.pathname === '/' ? "/aboutme" : "/"} lock={navLocks} >
              <div className={styles.avatar}></div>
            </AnimationLink>
            <div className={styles.navitems}>
              <NavItems navLocks={navLocks} />
            </div>
          </div>
        </header>
      </BrowserView>

      <MobileView>
        <header className={`${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_mobileside}`}>
          <Link to="/aboutme" onClick={handleToggleMenu}>
            <div className={styles.avatar}></div>
          </Link>
          <div className={navDisplayItems ? styles.navitems_display:styles.navitems_hide}>
            <div className={styles.navitems}>
              <NavItems navLocks={navLocks} />
            </div>
          </div>
        </header>
      </MobileView>


      {/* section */}
      <section className={styles.main}>
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
//---------------------------------Wrapper for nav
const NavItems = withRouter((props) => {
  const { navLocks } = props
  return (

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
     )

})

//---------------------------------Wrapper for animation
// Animation for switch pages
const AnimationRoute = withRouter((props) => {

  return (
    <TransitionGroup>
      <CSSTransition
        classNames="slide-in"
        timeout={500}
        key={props.location.pathname}
        unmountOnExit
        onExit={props.onLock}
        onExited={props.onUnlock}
        appear={true}
      >
        <div className={props.location.pathname} data-path={props.location.pathname}>
          <Route {...props} />
        </div>

      </CSSTransition>
    </TransitionGroup>
  );
})

// Animation for link when switching pages
const AnimationLink = withRouter((props) => {
  const { to, lock, onClick } = props;

  // lock when playing animation
  const handleClick = (e) => {
    if (lock && lock.includes(to)) e.preventDefault();
  }

  return (
    <Link to={to} onClick={handleClick} className={lock && lock.includes(to) || props.location.pathname === to ? styles.linkselected : styles.linkregular}>
      {props.children}
    </Link>
  )
})