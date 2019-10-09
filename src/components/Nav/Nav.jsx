import React, { useState, useEffect, useRef } from 'react';
import { BrowserView, MobileView, isMobileOnly } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';
import styles from './Nav.module.scss';
import './NavAnimation.scss';

import { load as flashIconLoad, imgSwitch, resize, resizeStart as flashIconResizeStart, resizeEnd as flashIconResizeEnd, callBack as flashIconCallBack } from '../../utils/flashicons';



export default withRouter((props) => {

    const avatarClasses = [
        styles.stage_entrance,
        styles.stage_nav,
        styles.stage_nav,
        styles.stage_nav,
        styles.stage_nav
    ];

    const { location, navLocks, navLinks, animationRotating } = props;
    const [navDisplayItems, setNavDisplayItems] = useState(true);
    const [cssAvatarStage, setCssAvatarStage] = useState();

    const cssOfDevice = isMobileOnly ? styles.nav_mobileside : styles.nav_desktopside;
    const cssParentAnimationPlay = animationRotating? styles.parentAnimationPlay : styles.parentAnimationStop;
    const avatarObserverRef = useRef(null)

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

    useEffect(() => {
        // 3rd parties
        const stageNumber = getStageNumber()
        setCssAvatarStage(getStageNumber());
        flashIconLoad("c", stageNumber);

        avatarObserverRef.current.addEventListener('animationstart', () => {
            // start resizing
            flashIconResizeStart();
        });

        avatarObserverRef.current.addEventListener('animationend', () => {
            // end resizing
            flashIconResizeEnd();
        });

        return () => {
        }
    }, [])

    // set animation stages
    useEffect(() => {
        setCssAvatarStage(getStageNumber());
    }, [location])

    useEffect(() => {
        imgSwitch(cssAvatarStage);
        return () => {
        }

    }, [cssAvatarStage])


    const getStageNumber = () => {
        let stageNumber = '';
        stageNumber = navLinks.findIndex((v) => {
            return v.to === location.pathname;
        });
        return stageNumber;        
    }


    return (
        <>
            {/* avatar */}
            <div className={["z_avatar", styles.avatar, cssOfDevice, cssParentAnimationPlay ,avatarClasses[cssAvatarStage]].join(' ')} ref={avatarObserverRef}>
                <Link to="/aboutme" onClick={handleToggleMenu}>
                    <canvas id="c">
                    </canvas>
                </Link>
            </div>

            {/* nav bar */}
            {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
            <header className={["z_nav", styles.container, cssOfDevice, cssParentAnimationPlay ,avatarClasses[cssAvatarStage]].join(' ')}>

                <div className={`${styles.navitems} ${navDisplayItems ? styles.navitems_show : styles.navitems_hide}`}>
                    <NavItems navLocks={navLocks} navLinks={navLinks} />
                </div>

            </header>

            {/* background of nav bar */}
            <div className={["z_board", styles.board, cssOfDevice, cssParentAnimationPlay, avatarClasses[cssAvatarStage]].join(' ')} />
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
        <li className={lock && lock.includes(to) || props.location.pathname === to ? styles.stage_linkselected : styles.stage_linkregular}>
            <Link to={to} onClick={handleClick}>
                {props.children}
            </Link>
        </li>
    )
})