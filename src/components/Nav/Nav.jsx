import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserView, MobileView, isMobileOnly } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import styles from './Nav.module.scss';
import './NavAnimation.scss';
import { PageStage, NavLinks } from '../../context/store';
import { unload as flashIconUnload, load as flashIconLoad, imgSwitch, fadeOut, fadeIn } from '../../utils/flashicons';

const INIT_AVATAR_SIZE = 512; // square picture
const CSS_ARRAY_STAGES = [
    styles.stage0,
    styles.stage1,
    styles.stage1,
    styles.stage1,
    styles.stage1,
    styles.stage1,
];

export default withRouter((props) => {

    const contextPageStage = useContext(PageStage);
    const { toIndex, fromIndex, loading } = contextPageStage;
    const { location, navLocks } = props;
    const [navDisplayItems, setNavDisplayItems] = useState(true);

    const avatarObserverRef = useRef(null)
    const navLinks = NavLinks;

    const CSS_OF_DEVICE = isMobileOnly ? styles.nav_mobileside : styles.nav_desktopside;
    let cssParentAnimationPlay = loading ? styles.parentAnimationPlay : styles.parentAnimationStop;

    /**
     * toggle menu. default true
     * @param {*} e 
     */
    const handleToggleMenu = (e) => {
        if (location.pathname !== '/') {

            if (navDisplayItems) { // or I can set it in useEffect
                imgSwitch(navLinks.length); // after all page icons, I set the last icon as the menu icon
            } else {
                imgSwitch(toIndex);
            }

            setNavDisplayItems(!navDisplayItems);

            e.preventDefault();
        }
    }

    //==================================================================== effects
    /**
     * initialize
     */
    useEffect(() => {

        // flash effect
        const w = toIndex === 0 ? INIT_AVATAR_SIZE : 128;
        const h = toIndex === 0 ? INIT_AVATAR_SIZE : 128;
        flashIconLoad("c", toIndex, w, h);

        return () => {
            flashIconUnload();
        }
    }, [])

    /**
     * effect switches. will fade out and fade in when switch between entrance and inner pages.
     */
    useEffect(() => {

        const w = toIndex === 0 ? INIT_AVATAR_SIZE : 128;
        const h = toIndex === 0 ? INIT_AVATAR_SIZE : 128;

        if (toIndex === fromIndex) { return; }
        else if (toIndex * fromIndex !== 0) { if (loading) imgSwitch(toIndex, w, h); }
        else {
            console.log("between entrance and pages");
            // when switch
            if (fromIndex === 0 && loading) {// entrance moving to inner, switch
                imgSwitch(toIndex, w, h);
            }
            if (fromIndex === 0 && !loading) { // entrance moved to inner, resize  
            }
            if (toIndex === 0 && loading) {// inner moving to entrance, switch
                imgSwitch(toIndex, w, h);
            }
            if (toIndex === 0 && !loading) {  // entrance moved to inner, resize
            }

            if (loading) fadeOut();
            else fadeIn();
        }

    }, [loading, toIndex]);



    const cssHideItems = navDisplayItems ? styles.show : styles.hide;

    return (
        <>
            {/* avatar */}
            <div className={[
                "z_avatar",
                styles.avatar,
                CSS_OF_DEVICE,
                cssHideItems,
                cssParentAnimationPlay,
                CSS_ARRAY_STAGES[toIndex]
            ].join(' ')} ref={avatarObserverRef}>
                <Link to="/aboutme" onClick={handleToggleMenu}>
                    <canvas id="c">
                    </canvas>
                </Link>
            </div>

            {/* nav bar */}
            {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
            <header className={["z_nav", styles.navContainer, CSS_OF_DEVICE, cssParentAnimationPlay, CSS_ARRAY_STAGES[toIndex]].join(' ')}>

                <div className={[styles.navitems, cssHideItems].join(' ')}>
                    <NavItems navLocks={navLocks} navLinks={navLinks} />
                </div>

            </header>

            {/* background of nav bar */}
            <div className={["z_board", styles.board, cssHideItems, CSS_OF_DEVICE, cssParentAnimationPlay, CSS_ARRAY_STAGES[toIndex]].join(' ')} />
        </>
    )
})



/**
 * ---------------------------------Wrapper for nav links
 */
const NavItems = withRouter((props) => {
    const { navLocks, navLinks } = props;

    return (
        <ul>
            {navLinks.map((item, key) => {

                return (

                    <AnimationLink to={item.to} lock={navLocks} key={key} index={key}>
                        {item.title}
                    </AnimationLink>
                )
            })}
        </ul>
    )
});


/**
 * wrapper: lock the effected link when switching pages(to prevent flickering)
 */
const AnimationLink = withRouter((props) => {
    const { to, lock, location } = props;

    /**
     * lock the nav <a> when playing animation. else record page
     * @param {*} e 
     */
    const handleClick = (e) => {
        if (_.includes(lock, to)) e.preventDefault();
    }

    return (
        <li className={(_.includes(lock, to)) || location.pathname === to ? styles.state_linkselected : styles.state_linkregular}>
            <Link to={to} onClick={handleClick}>
                <span>{props.children}</span>
            </Link>
        </li>
    )
})