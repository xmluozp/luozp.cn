import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import useCancelableTimeout from "use-cancelable-timeout";
import _ from 'lodash';
import { PageStage, NavLinks } from '../../context/store';
import { unload as flashIconUnload, load as flashIconLoad, imgSwitch, fadeOut, fadeIn } from '../../utils/flashicons';
import styles from './Nav.module.scss';
import stylesAvatar from './Avatar.module.scss';


const INIT_AVATAR_SIZE = 512; // square picture
const NAV_CLOSE_DELAY = 3000;


const CSS_ARRAY_STAGES = [    // currently has only 2 stages, but still prepare for all.
    styles.stage0,
    styles.stage1,
    styles.stage1,
    styles.stage1,
    styles.stage1,
    styles.stage1,
];

const CSS_ARRAY_STAGES_AVATAR = [    // currently has only 2 stages, but still prepare for all.
    stylesAvatar.stage0,
    stylesAvatar.stage1,
    stylesAvatar.stage1,
    stylesAvatar.stage1,
    stylesAvatar.stage1,
    stylesAvatar.stage1,
];

export default withRouter((props) => {

    const contextPageStage = useContext(PageStage);
    const { toIndex, fromIndex, loading } = contextPageStage;
    const { location, navLocks } = props;
    const [navShow, setNavShow] = useState(true);                   // if display nav
    const [isEntering, setIsEntering] = useState(false);             // if playing enter animation

    // const [isNavDelayHide, setIsNavDelayHide] = useState(true);     // when entered, hide nav bar after a few seconds

    // hide nav bar after delay
    // const [onDelayStart, onDelayCancel] = useCancelableTimeout(
    //     () => {
    //         if (isNavDelayHide) {
    //             toggleNav(false);
    //         }
    //     },
    //     NAV_CLOSE_DELAY,
    // );

    const [onDelayEnter, onDelayEnterCancel] = useCancelableTimeout(
        () => {
            props.history.push('/aboutme');
            setIsEntering(false); // release enter delay
        },
        3000,
    );


    const avatarObserverRef = useRef(null)
    const navLinks = NavLinks;
    const cssParentAnimationPlay = loading ? styles.parentAnimationPlay : styles.parentAnimationStop;

    /**
     * toggle menu. default true
     * The reason I reuse the big face to be both menu and entrance button: the performance of WebGl
     * @param {*} e 
     */
    const handleToggleMenu = (e) => {
        if (location.pathname !== '/') {
            toggleNav(!navShow);

        } else if(!isEntering){
            // lock the enter button
            setIsEntering(true);

            // play animation
            imgSwitch(toIndex, false, false, 0.05);

            fadeOut();

            // enter after animation
            onDelayEnter();
        }

        e.preventDefault();
    }

    const toggleNav = (isShow) => {

        if (!isShow) { // or I can set it in useEffect
            imgSwitch(navLinks.length); // after all page icons, I set the last icon as the menu icon
        } else {
            imgSwitch(toIndex);
        }
        setNavShow(isShow);
       

        // any action from user, cancel timeout.
        // setIsNavDelayHide(false);
        // onDelayCancel();
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

        // reset the icon
        const w = toIndex === 0 ? INIT_AVATAR_SIZE : 128;
        const h = toIndex === 0 ? INIT_AVATAR_SIZE : 128;

        if (toIndex === fromIndex) { return; }
        else if (toIndex * fromIndex !== 0) { if (loading) imgSwitch(toIndex, w, h); }
        else {
            // when switch
            if (fromIndex === 0 && loading) {   // entrance moving to inner, switch
                imgSwitch(toIndex, w, h);
            }
            if (fromIndex === 0 && !loading) {  // entrance moved to inner, resize  
                fadeIn();
            }
            if (toIndex === 0 && loading) {     // inner moving to entrance, switch
                
                fadeOut();
            }
            if (toIndex === 0 && !loading) {    // entrance moved to inner, resize
                imgSwitch(toIndex, w, h);
                fadeIn();
            }
        }

        // // delay and hide the nav bar      
        // if (loading && (toIndex !== 0)) {       // if: finished animation + not in root
        //     setIsNavDelayHide(true);
        //     onDelayCancel();
        //     if(!isMobileOnly){
        //        onDelayStart();
        //     }
           
        // }
        // if (toIndex === 0) {                    // if: its root, dont trigger the Nav hiding timer
        //     // onDelayCancel();
        // }

    }, [loading, toIndex]);

    const cssNavShow = navShow ? styles.show : styles.hide;

    return (
        <>
            {/* avatar */}
            <div className={[
                "z_avatar",
                stylesAvatar.avatar,
                cssNavShow,
                cssParentAnimationPlay,
                CSS_ARRAY_STAGES_AVATAR[toIndex]
            ].join(' ')} ref={avatarObserverRef}>
                <Link to="/aboutme" onClick={handleToggleMenu}>
                    <canvas id="c">
                    </canvas>
                </Link>
            </div>

            {/* nav bar */}
            {/* check if display icon as the avatar(entrance) or a nav(inner pages) */}
            <header className={["z_nav", styles.navContainer, cssParentAnimationPlay, CSS_ARRAY_STAGES[toIndex]].join(' ')}>

                <div className={[styles.navitems, cssNavShow].join(' ')}>
                    <NavItems navLocks={navLocks} navLinks={navLinks} />
                </div>

            </header>

            {/* background of nav bar */}
            <div className={["z_board", styles.board, cssNavShow, cssParentAnimationPlay, CSS_ARRAY_STAGES[toIndex]].join(' ')} />
            <div className={["z_overlay", styles.overlay, cssNavShow, CSS_ARRAY_STAGES[toIndex]].join(' ')}  onClick={handleToggleMenu} />
        
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