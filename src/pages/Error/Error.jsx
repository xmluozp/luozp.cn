import React from 'react';
import styles from './Error.module.scss';
import { Link } from 'react-router-dom';
import DelayLoader from '../../utils/DelayLoader/DelayLoader';

export default (props) => {
    return (
        // don't set padding or margin here. this is a styleing box
        <DelayLoader delay={1000} fade={true}>
            <div
                className={[
                    "page_container",
                    styles.conatiner
                ].join(' ')}>


                <div className={styles.pageInnerContainer}>
                    <div className={styles.error404}>
                        <header className={styles.title}>
                            <span className={styles.hole}>404</span>
                            <span className={styles.aura}>404</span>
                        </header>

                    </div>
                    <div className={styles.error404rv}>
                        <div className={styles.titlerv}>404</div>
                    </div>
                </div>
                {/* a funny face bottom left */}
                <div className={styles.userFace}></div>
                <div className={styles.popup}>
                    This place is weird. I'm <Link to="/">going back</Link>
                </div>


            </div>
        </DelayLoader>
    );
}

