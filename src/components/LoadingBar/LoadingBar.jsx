import React, { useState } from 'react';
import styles from './LoadingBar.module.scss';


export default (props) => {

    const speed = 1000;
    const { title, status, scale, rank, className } = props;
    
    // status: wait/start/done

    let cssRank = {};

    switch (status) {
        case 'wait':
            cssRank = {width: '20%', transition: `width ${speed}ms ease-out`}
            break;
        case 'start':
            cssRank = {width: '20%', transition: `width ${speed}ms ease-out`}
            break;
        case 'done':
            cssRank = {width: rank + '%', transition: `width ${speed}ms ease-out`}
            break;
        default:
            break;
    }

    return (
        <div className={styles.box + ' ' + className}>
            <div className={styles.shine}>
                <span>{title}</span>
            </div>
            <div className={styles.fill} style={cssRank}>
                <div className={styles.color}></div>
            </div>
            <div className={styles.empty}>
                <span>{rank}%</span>
            </div>
        </div>
    )
}