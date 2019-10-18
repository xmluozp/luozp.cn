import React, { useState } from 'react';
import styles from './Social.module.scss';

import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';


export default ({theme}) => {

    const mystyle = theme ==='darkbg'? styles.social_darkbg : styles.social_lightbg
    

    return <>

        <a className={mystyle} href="https://github.com/xmluozp" target="_blank" title="GitHub of Zhaoping Luo"><GitHubIcon /></a>
        <a className={mystyle} href="https://www.linkedin.com/in/zhaopingluo/" target="_blank" title="LinkedIn of Zhaoping Luo"><LinkedInIcon /></a>
        <a className={mystyle} href="https://www.facebook.com/luo.zhaoping" target="_blank" title="FaceBook of Zhaoping Luo"><FacebookIcon /></a>

    </>
}