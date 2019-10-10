import React, { useState, useEffect, useContext } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// css
import styles from './App.module.scss';
import './App.scss';

// pages
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';
import AboutWebsite from './AboutWebsite/AboutWebsite';
import Blog from './Blog/Blog';
import TechStack from './TechStack/TechStack';

// components
import Nav from '../components/Nav/Nav';

// context
import { PageStage } from '../context/stageContext';


function App(props) {

  // only run once. hide the loader for the website
  if (document.getElementById('global_loader')) {
    document.getElementById('global_loader').classList.add('global_loader_hide');
    setTimeout(() => {
      document.getElementById('global_loader') && document.getElementById('global_loader').remove();
    }, 2000);
  }




  //**************************************************************************/
  const navLinks = [
    { title: "Home", to: "/" },
    { title: "Personal", to: "/aboutme" },
    { title: "Skill Sets", to: "/techstack" },
    { title: "Blog", to: "/blog" },
    { title: "About", to: "/aboutwebsite" },
  ];

  const [navLocks, setNavLocks] = useState([]);
  const contextPageStage = useContext(PageStage);
  contextPageStage.fromIndex = navLinks.findIndex((v) => {
    return v.to === props.location.pathname;
  });
  contextPageStage.fromPath = props.location.pathname;


  // ==============================handlers
  /**
   * have a lock list. in order to prevent messing up page animations when hitting nav items too quick
   * @param {*} e 
   */
  const handlePageChangeStart = (e) => {

    console.log("move start");
    if(!contextPageStage.loading) contextPageStage.loading = true;

    // handle async of set state
    setNavLocks(prevState => {
      const currentLocks = prevState.slice();
      if (!currentLocks.includes(e.getAttribute('data-path'))) currentLocks.push(e.getAttribute('data-path'));
      return currentLocks;
    });
  }

  /**
   * check and unloack navs when animation over (from any pages)
   * @param {*} e 
   */
  const handlePageChangeStop = (e) => {

    const path = e.getAttribute('data-path');
    // handle async of set state
    setNavLocks(prevState => {
      return new Array(...prevState.filter((value) => {
        return value !== path;
      }))
    });
  }

  // ==============================effects
  /**
   * initialize
   */
  useEffect(() => {


  }, [])

  /**
   * ending of animation, release loading state
   */
  useEffect(() => {
    // control lock of navs
    if (navLocks.length === 0 && contextPageStage.loading) {
      contextPageStage.loading = false;
    }
    console.log("stop");
  }, [navLocks])


  return (
    <>
      <Nav navLocks={navLocks} navLinks={navLinks} />
      {/* section */}
      <section className={`z_main ${styles.main} ${contextPageStage.loading ? styles.main_lock : styles.main_unlock}`}>
        <AnimationRoute path="/" exact component={Home} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/blog" exact component={Blog} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/techstack" exact component={TechStack} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/aboutwebsite" exact component={AboutWebsite} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
      </section>
    </>
  );
}

export default withRouter(App);

/**
 * ---------------------------------Wrapper for animation
 */
const AnimationRoute = withRouter((props) => {

  const timeout = 80000;

  console.log("location" + props.location.pathname +  " path" + props.path)

  /**
   * use "Transition group" because we want to temporary keep the page while its exiting.
   * here is "key" attribute to trigger animation, if you want to use CSSTransition, there is an "in" attribute
   */
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
        appear={props.location.pathname === props.path}
      >
        <div className={props.path} data-path={props.path}>
          <Route {...props} />
        </div>

      </CSSTransition>
    </TransitionGroup>
  );
})