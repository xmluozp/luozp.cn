import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import QueueLoader from '../../utils/QueueLoader/QueueLoader';
import styles from './TechStack.module.scss';

export default (props) => {


    const handleAllLoaded = () => {

    }

    const [dataSkills, setDataSkills] = useState([])

    useEffect(() => {
        async function fetchData() {

            const result = await axios('./dataset/skillset.json');
            if (result.status === 200) {
                setDataSkills(result.data.dataset);
            }

        }
        fetchData();

        return () => { };
    }, []);




    return (
        <div className={`${styles.conatiner} page_container`}>
            <div className={styles.pageInnerContainer}>
                <div className={styles.floating}>

                    <div className={styles.annoyingTalkWrapper}>
                        <div className={styles.annoyingTalk}>
                            If all you have is a hammer, everything looks like a nail -- Abraham Maslow. <br/>
                        </div>
                    </div>
                    <div>
                        {dataSkills.map((category, key) => {
                            return <section className={styles.category} key={category.title}>
                                <div className={styles.floating_l}>
                                    <span>{category.title}</span>
                                </div>
                                <div className={styles.floating_r}>
                                    <QueueLoader key={category.title + " queue"} delay={300} onAllLoaded={handleAllLoaded}>
                                        {category.skills.sort((a, b) => b.rank - a.rank) // order by rank
                                            .map((skill) => {
                                                return <LoadingBar key={skill.title} title={skill.title} rank={skill.rank} className={styles.LoadingBar} />
                                            })}
                                    </QueueLoader>
                                </div>
                            </section>
                        })}
                    </div>
                    
                </div>
                <div className={styles.theEnd}></div>
            </div>

        </div>
    );

}

//===================