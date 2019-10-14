import React, { useState, useEffect, useContext } from 'react';
// import { isMobileOnly } from 'react-device-detect';
import { Link, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import "core-js/stable";
import _ from 'lodash';

// css
import styles from './App.module.scss';
import './App.scss';

// pages
import Home from './Home/Home';
import AboutMe from './AboutMe/AboutMe';
import AboutWebsite from './AboutWebsite/AboutWebsite';
import Blog from './Blog/Blog';
import TechStack from './TechStack/TechStack';
import History from './History/History';

// components
import Nav from '../components/Nav/Nav';
import Title from '../components/Title/Title';

// context
import { PageStage } from '../context/store';

// const CSS_OF_DEVICE = isMobileOnly ? styles.mobileside : styles.desktopside;

function App(props) {

  // only run once. hide the loader for the website
  const websiteLoading = document.getElementById('global_loader');
  if (websiteLoading) {
    websiteLoading.classList.add('global_loader_hide');
    setTimeout(() => {
      websiteLoading && websiteLoading.parentNode && websiteLoading.parentNode.removeChild(websiteLoading);
    }, 500);
  }

  
  //**************************************************************************/
  const [navLocks, setNavLocks] = useState(new Array(props.location.pathname));
  const contextPageStage = useContext(PageStage);


  // ==============================handlers
  /**
   * have a lock list. in order to prevent messing up page animations when hitting nav items too quick
   * @param {*} e 
   */
  const handlePageChangeStart = (e) => {

    // switching page
    contextPageStage.loading = true;

    // handle async of set state
    setNavLocks(prevState => {
      const currentLocks = prevState.slice();

      const path = e.getAttribute('data-path');

      if (!_.includes(currentLocks, path)) currentLocks.push(path);
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
    window.addEventListener('scroll', (e)=>{
      // console.log(e);
    }, false);

    window.addEventListener('resize', (e)=>{
      // console.log("client width", window.clientWidth);
    }, false);

    return () => {
      //
    };
  },[])

  /**
   * ending of animation, release loading state
   */
  useEffect(() => {
    // control lock of navs
    if (navLocks.length === 0) {
      contextPageStage.loading = false;
    }
  }, [navLocks])

  return (
    <>
      <Title />
      <Nav navLocks={navLocks} />
      {/* section */}

      <section className={[
        "z_main",
        styles.main,
        contextPageStage.loading ? styles.main_lock : styles.main_unlock,
      ].join(' ')} onScroll={(e)=>{ console.log(e); }}>

        <AnimationRoute path="/" exact component={Home} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/techstack" exact component={TechStack} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/history" exact component={History} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/aboutwebsite" exact component={AboutWebsite} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
        <AnimationRoute path="/blog" exact component={Blog} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
      </section>
    </>
  );
}

export default withRouter(App);

/**
 * use "Transition group" because we want to temporary keep the page while its exiting.
 * here is "key" attribute to trigger animation, if you want to use CSSTransition, there is an "in" attribute
 */
const AnimationRoute = withRouter((props) => {

  const timeout = 1500;
  // const contextPageStage = useContext(PageStage);
  // const className = props.path + ' ' + (contextPageStage.toIndex * contextPageStage.fromIndex === 0 ? "animation_entrance" : "animation_inners");

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