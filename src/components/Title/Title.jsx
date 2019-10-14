import React, { useContext } from 'react';
import { PageStage, NavLinks } from '../../context/store';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';


import styles from './Title.module.scss';


export default (props) => {

    const contextPageStage = useContext(PageStage);
    const {  toIndex } = contextPageStage;

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
                'z_title',
                cssStage,
                styles.title,
            ].join(' ')}>
                {NavLinks.map((item, key) => {
                    return (
                        <TitleItem title={item.title} key={key} index={key} show={key === toIndex}/>
                    )
                })}
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

const TitleItem = (props) => {

    const { title, index, show } = props;
    const contextPageStage = useContext(PageStage);
    const { fromIndex, toIndex, loading } = contextPageStage;

    // if switch between these two, plus its loading
    const isLoading = (fromIndex == index || toIndex == index) && loading? styles.loading: styles.done;
    const spanClassNames = (show? styles.show: styles.hide) + " " + isLoading;

    return(<span className={spanClassNames}>{title}</span>)

}