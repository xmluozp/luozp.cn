import React, { useContext } from 'react';
import { PageStage, NavLinks } from '../../context/store';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


import styles from './Title.module.scss';


export default (props) => {

    const contextPageStage = useContext(PageStage);
    const { toIndex } = contextPageStage;


    // get current stage by current path
    const cssStage = ([
        styles.stage0,
        styles.stage1,
        styles.stage1,
        styles.stage1,
        styles.stage1,
        styles.stage1        
    ])[toIndex];
    
    return (
    <>
        <h1 className={[
                "z_title",
                cssStage,
                styles.title,
                ].join(' ')}>

           <span>{ NavLinks[toIndex]?NavLinks[toIndex].title:null }</span> 
        </h1>
        <div className={[
                "z_title_board",
                cssStage,
                styles.board
                ].join(' ')}>
        </div>
    </> 
    
    );



}