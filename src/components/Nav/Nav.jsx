import React, { useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';

import styles from './Nav.module.scss';


export default withRouter((props) => {
    const { location, navLocks, navLinks } = props;
    const [navDisplayItems, setNavDisplayItems] = useState(true);

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


    return (
        <>
            {/* header */}
            <BrowserView>
                {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
                <header className={`z_nav ${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_side}`}>
                    <div className={styles.animation_menu}>
                        {/* if its entrance, hit the avatar will go to: [about me] */}
                        <AnimationLink to={location.pathname === '/' ? "/aboutme" : "/"} lock={navLocks} >
                            <div className={styles.avatar}></div>
                        </AnimationLink>

                        <NavItems navLocks={navLocks} navLinks={navLinks} />

                    </div>
                </header>
            </BrowserView>

            <MobileView>
                {/* check if display icon as the avatar(entrance) or a mobile nav(inner pages) */}
                <header className={`z_nav ${styles.header} ${location.pathname === '/' ? styles.nav_entrance : styles.nav_mobileside}`}>

                    {/* if its inner pages, hit the avatar will display the nav*/}
                    <Link to="/aboutme" onClick={handleToggleMenu}>
                        <div className={styles.avatar}></div>
                    </Link>

                    {/* display the nav */}
                    <div className={navDisplayItems ? styles.navitems_display : styles.navitems_hide}>
                        <NavItems navLocks={navLocks} navLinks={navLinks} />
                    </div>
                </header>
            </MobileView>
        </>
    )
})


//---------------------------------Wrapper for nav links
const NavItems = withRouter((props) => {
    const { navLocks, navLinks } = props;

    return (
        <div className={styles.navitems}>
            <ul>
                {navLinks.map((item, key) => {
                    return (<li key={key}>
                        <AnimationLink to={item.to} lock={navLocks} >
                            {item.title}
                        </AnimationLink>
                    </li>)
                })}
            </ul>
        </div>
    )
});

// wrapper: lock the effected link when switching pages(to prevent flickering)
const AnimationLink = withRouter((props) => {
    const { to, lock } = props;

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