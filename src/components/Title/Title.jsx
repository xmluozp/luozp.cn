import React, { useContext } from 'react';
import { PageStage, NavLinks } from '../../context/store';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


import styles from './Title.module.scss';


export default (props) => {

    const contextPageStage = useContext(PageStage);
    const { toIndex } = contextPageStage;

    return (
    <>
    <h1 className={[
            "z_title",
            styles.title
            ].join(' ')}>

        { NavLinks[toIndex].title }
    </h1>
    <div className={[
            "z_title_board",
            styles.board
            ].join(' ')}>
    </div>
    </> 
    
    );



}