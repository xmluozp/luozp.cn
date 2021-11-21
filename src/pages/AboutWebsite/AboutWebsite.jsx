import React from 'react';
import styles from './AboutWebsite.module.scss';

export default (props) => {
    return (
        // don't set padding or margin here. this is a styleing box
        <div
            className={[
                "page_container",
                styles.conatiner
            ].join(' ')}>


            <div className={styles.pageInnerContainer}>
                <div className={styles.popup}>
                <p>First of all, this shining effect is from Kenji Saito's Codepen, I restructured his codes, added fadein, fadeout and changed calculation of vertices</p>
                <p><a href="https://www.npmjs.com/package/react-webgl-noiseeffect" target="_blank">It's now on npm</a></p>

                    <p>"Catching new tech is painful." Years ago, I used to believe.</p>
                    <p>Whenever a new tech came out, I thought: "Wat? My stuff is becoming garbage again?". </p>
                    <p>Now I've changed my mind.</p>
                    <p>New programming tech is usually an elegant and better version of old ones. That's why people want to replace what they've already mastered.</p>

                    <p>For this personal website, I integrated all things fresh to me, for practice.</p>
                    <p>Functional components + Hooks in React CRA, css modules + scss, animation Routes , a WebGL effect, WSL Ubuntu in VS Code, Git + Heroku auto deployment.</p>
                    <p>For some technologies, I only did "learning by doing" in my former projects to catch the deadline; for some technologies I just finished online courses or school projects so I need more practice.</p>
                </div>
            </div>
        </div>
    );
}

