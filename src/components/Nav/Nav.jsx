import React, { useState, useEffect } from 'react';
import { BrowserView, MobileView, isMobileOnly } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';

import styles from './Nav.module.scss';


export default withRouter((props) => {

    const avatarClasses = [
        styles.stage_entrance,
        styles.stage_nav
    ];

    const { location, navLocks, navLinks } = props;
    const [navDisplayItems, setNavDisplayItems] = useState(true);
    const [cssAvatarStage, setCssAvatarStage] = useState(avatarClasses[0]);
    const classOfDevice = isMobileOnly ? styles.nav_mobileside : null;


    // toggle menu
    const handleToggleMenu = (e) => {
        if (location.pathname !== '/') {
            setNavDisplayItems(!navDisplayItems);
            e.preventDefault();
        }
        else {
            // setNavDisplayItems(false);
        }
    }

    // set animation stages
    useEffect(() => {
        let stageClass = '';
        
        switch (location.pathname) {
            case '/':
                stageClass = avatarClasses[0];
                break;

            default:
                stageClass = avatarClasses[1];
                break;
        }

        setCssAvatarStage(stageClass);
    }, [location])

    return (
        <>
            {/* avatar */}
            <div className={["z_avatar", styles.avatar, classOfDevice, cssAvatarStage].join(' ')}>
                <Link to="/aboutme" onClick={handleToggleMenu}>

                </Link>
            </div>

            {/* nav bar */}
            {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
            <header className={["z_nav", styles.container, classOfDevice, cssAvatarStage].join(' ')}>

                <div className={`${styles.navitems} ${navDisplayItems ? styles.navitems_show : styles.navitems_hide}`}>
                    <NavItems navLocks={navLocks} navLinks={navLinks} />
                </div>

            </header>
        </>
    )
})


//---------------------------------Wrapper for nav links
const NavItems = withRouter((props) => {
    const { navLocks, navLinks } = props;

    return (
        <ul>
            {navLinks.map((item, key) => {
                return (
                    <AnimationLink to={item.to} lock={navLocks} key={key}>
                        {item.title}
                    </AnimationLink>
                )
            })}
        </ul>

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
        <li>
            <Link to={to} onClick={handleClick} className={lock && lock.includes(to) || props.location.pathname === to ? styles.linkselected : styles.linkregular}>
                {props.children}
            </Link>
        </li>
    )
})