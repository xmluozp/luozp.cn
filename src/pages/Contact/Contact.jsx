import React, { useState } from 'react';
import styles from './Contact.module.scss';
import GoogleApi from '../../utils/GoogleApiWrapper/GoogleApiWrapper';
import DelayLoader from '../../utils/DelayLoader/DelayLoader';
import Form from '../../components/Form/Form';
import Social from '../../components/Social/Social';


export default (props) => {
    const [formMessage, setFormMessage] = useState("Submit a form.")

    const handleFormMessage = (message) => {
        setFormMessage(message);
    }


    return (

        <div className={`${styles.conatiner} page_container`}>
            {/* wrapper to prevery margin collapse */}
            <div className={styles.pageInnerContainer}>

                {/* wrapper to locate */}
                <div className={styles.floating}>
                    <div className={styles.floating_l}>
                        <div className={styles.googleMap}>
                            <div className={styles.googleMapWrapper}>
                                <DelayLoader delay={2000}>
                                    <GoogleApi />
                                </DelayLoader>
                                
                            </div>
                        </div>
                    </div>
                    <div className={styles.floating_r}>
                        <div className={styles.annoyingTalkWrapper}>
                            <div className={styles.annoyingTalk}>
                                Here you are!! Zhaoping is ready to join your adventure. To invite him, your just need to...
                                <br /><span className={styles.errorMessages}>{formMessage}</span>
                            </div>
                        </div>
                        <div className={styles.popup}>
                            <Form onMessage={handleFormMessage} />
                        </div>

                        <div className={styles.userFace}>


                            <div className={styles.mySocial}>
                                <Social theme='darkbg' />
                            </div>
                        </div>

                    </div>



                </div>

            </div>


            <div className={styles.theEnd}></div>
        </div>
    );
}

