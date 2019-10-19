import React, { useState, useEffect, useContext } from 'react';
// import { isMobileOnly } from 'react-device-detect';
import { Route, withRouter } from 'react-router-dom';
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
import Contact from './Contact/Contact';
import TechStack from './TechStack/TechStack';
import History from './History/History';
import Error from './Error/Error';

// components
import Nav from '../components/Nav/Nav';
import Title from '../components/Title/Title';

// context
import { PageStage, NavLinks } from '../context/store';

//****************************************************************************************************/
//****************************************************************************************************/
//****************************************************************************************************/
//****************************************************************************************************/

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
  const [navLocks, setNavLocks] = useState([]);
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

      // only lock the link in the path list
      const validPaths = Array.from(NavLinks, item => item.to);   

      // lock the nav.
      if (!_.includes(currentLocks, path) && _.includes(validPaths, path)) currentLocks.push(path);
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

  /**
   * ending of every page rolling animation, release loading state
   */
  useEffect(() => {
    // control lock of navs
    if (navLocks.length === 0) {
      contextPageStage.loading = false;
    }
  }, [navLocks])


  return (
    <>

      {contextPageStage.toIndex !== -1 ?
        <>
          <Title />
          <Nav navLocks={navLocks} />
          {/* section */}
          <section className={[
            "z_main",
            styles.main,
            contextPageStage.loading ? styles.main_lock : styles.main_unlock,
          ].join(' ')}>

            <AnimationRoute path="/" exact component={Home} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
            <AnimationRoute path="/aboutme" exact component={AboutMe} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
            <AnimationRoute path="/techstack" exact component={TechStack} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
            <AnimationRoute path="/history" exact component={History} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
            <AnimationRoute path="/aboutwebsite" exact component={AboutWebsite} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
            <AnimationRoute path="/contact" exact component={Contact} onLock={handlePageChangeStart} onUnlock={handlePageChangeStop} />
          </section>
        </>
        : 
        <Error/>
      }

    </>
  );
}

export default withRouter(App);

/**
 * use "Transition group" because we want to temporary keep the page while its exiting.
 * here is "key" attribute to trigger animation, if you want to use CSSTransition, there is an "in" attribute
 */
const AnimationRoute = withRouter((props) => {
  const TIMEOUT = 1500;
  return (
    <TransitionGroup>
      <CSSTransition
        classNames="slide-in"
        timeout={TIMEOUT}
        key={props.location.pathname === props.path}
        onExit={props.onLock}
        onExited={props.onUnlock}
        onEnter={props.onLock}
        onEntered={props.onUnlock}
        appear={true}
      >
        <div className={props.path} data-path={props.path}>

          {/* <DelayLoader delay={LOAD_DELAY} > */}
              <Route {...props} />
          {/* </DelayLoader> */}

        </div>

      </CSSTransition>
    </TransitionGroup>
  );
})