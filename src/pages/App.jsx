import React, { useState } from 'react';
import styles from './App.module.scss';
import './App.scss';
import { Link, Route, withRouter } from 'react-router-dom';
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';



function App(props) {

  const { location } = props;
  const [navLocks, setNavLocks] = useState([]);

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


  // Main JSX
  return (

    <>

      {/* header */}
      <header className={styles.header}>
        <div className={styles.box}>
          <Link to="/"><div className={styles.boxleft}>Logo</div></Link>
          <div className={styles.boxright}>
            <AnimationLink to="/" lock={navLocks} >
              <p>HOME</p>
            </AnimationLink>
            <AnimationLink to="/aboutme" lock={navLocks} >
              <p>About Me</p>
            </AnimationLink>
          </div>
        </div>
      </header>

      {/* section */}
      <section className={styles.main}>

        <AnimationRoute path="/" exact component={Home} onLock={handleLockNav} onUnlock={handleUnlockNav} />
        <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handleLockNav} onUnlock={handleUnlockNav} />

      </section>
    </>
  );
}

export default withRouter(App);


//---------------------------------Wrapper for animation

// Animation for switch pages
const AnimationRoute = withRouter((props) => {

  return (
    <TransitionGroup>
      <CSSTransition
        classNames="slide-in"
        timeout={2000}
        key={props.location.pathname}
        unmountOnExit
        onExit={props.onLock}
        onExited={props.onUnlock}

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
    if (lock.includes(to)) e.preventDefault();
  }

  return (
    <Link to={to} onClick={handleClick} className={lock.includes(to) || props.location.pathname === to ? styles.linkselected : styles.linkregular}>
      {props.children}
    </Link>
  )
})