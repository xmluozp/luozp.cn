import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserView, MobileView, isMobileOnly } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';
import styles from './Nav.module.scss';
import './NavAnimation.scss';
import { PageStage } from '../../context/stageContext';
import { load as flashIconLoad, imgSwitch, fadeOut, fadeIn } from '../../utils/flashicons';

const INIT_AVATAR_SIZE = 512; // square picture
const CSS_ARRAY_STAGES = [
    styles.stage0,
    styles.stage1,
    styles.stage1,
    styles.stage1,
    styles.stage1
];

export default withRouter((props) => {

    const contextPageStage = useContext(PageStage);
    const { location, navLocks, navLinks } = props;
    const [navDisplayItems, setNavDisplayItems] = useState(true);
    const [cssAvatarStage, setCssAvatarStage] = useState();
    const avatarObserverRef = useRef(null)

    const CSS_OF_DEVICE = isMobileOnly ? styles.nav_mobileside : styles.nav_desktopside;
    const CSS_OF_PARENT_ANIMATION_PLAY = contextPageStage.loading ? styles.parentAnimationPlay : styles.parentAnimationStop;

    /**
     * toggle menu. default true
     * @param {*} e 
     */
    const handleToggleMenu = (e) => {
        if (location.pathname !== '/') {
            setNavDisplayItems(!navDisplayItems);
            e.preventDefault();
        }
    }

    //==================================================================== effects
    /**
     * initialize
     */
    useEffect(() => {

        // 3rd flash effect
        const stageNumber = contextPageStage.fromIndex
        setCssAvatarStage(contextPageStage.fromIndex);

        const w = stageNumber == 0 ? INIT_AVATAR_SIZE : 128;
        const h = stageNumber == 0 ? INIT_AVATAR_SIZE : 128;

        flashIconLoad("c", stageNumber, w, h);

        return () => {
            // unload
        }
    }, [])

    /**
     * set animation stages.
     */
    useEffect(() => {
        setCssAvatarStage(contextPageStage.fromIndex);
    }, [location])

    /**
     * 3rd party animation switch. the reason it's on css change. because both "first open" and "switching" need it.
     */
    useEffect(() => {

        // size change when switch between entrance and inner pages. doesn't get dynamic size -- in order to optimize the animation
        const w = cssAvatarStage == 0 ? INIT_AVATAR_SIZE : 128;
        const h = cssAvatarStage == 0 ? INIT_AVATAR_SIZE : 128;
        imgSwitch(cssAvatarStage, w, h);

        return () => {
        }

    }, [cssAvatarStage])

    useEffect(() => {
        console.log(contextPageStage);
    }, [contextPageStage])



    return (
        <>
            {/* avatar */}
            <div className={["z_avatar", styles.avatar, CSS_OF_DEVICE, CSS_OF_PARENT_ANIMATION_PLAY ,CSS_ARRAY_STAGES[cssAvatarStage]].join(' ')} ref={avatarObserverRef}>
                <Link to="/aboutme" onClick={handleToggleMenu}>
                    <canvas id="c">
                    </canvas>
                </Link>
            </div>       

            {/* nav bar */}
            {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
            <header className={["z_nav", styles.navContainer, CSS_OF_DEVICE, CSS_OF_PARENT_ANIMATION_PLAY ,CSS_ARRAY_STAGES[cssAvatarStage]].join(' ')}>

                <div className={`${styles.navitems} ${navDisplayItems ? styles.navitems_show : styles.navitems_hide}`}>
                    <NavItems navLocks={navLocks} navLinks={navLinks} />
                </div>

            </header>

            {/* background of nav bar */}
            <div className={["z_board", styles.board, CSS_OF_DEVICE, CSS_OF_PARENT_ANIMATION_PLAY, CSS_ARRAY_STAGES[cssAvatarStage]].join(' ')} />
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
                    <AnimationLink to={item.to} lock={navLocks} key={key}>
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
    const { to, lock, location, key } = props;
    const contextPageStage = useContext(PageStage);

    /**
     * lock the nav <a> when playing animation. else record page
     * @param {*} e 
     */
    const handleClick = (e) => {
        if (lock && lock.includes(to)) e.preventDefault();
        else{
            console.log("on link click");
            contextPageStage.fromPath = location.pathname;
            contextPageStage.toPath = to;
            contextPageStage.fromIndex = contextPageStage.index;
            contextPageStage.toIndex = key;
            // contextPageStage.loading = true; // set it on page animation trigger. not here
        }
    }

    return (
        <li className={lock && lock.includes(to) || location.pathname === to ? styles.state_linkselected : styles.state_linkregular}>
            <Link to={to} onClick={handleClick}>
                <span>{props.children}</span>
            </Link>
        </li>
    )
})