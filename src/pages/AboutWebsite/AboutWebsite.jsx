import React from 'react';
import styles from './AboutWebsite.module.scss';

export default (props) => {
    return (
        <div className={`${styles.testColor} page_container`}>
            about website


            <p>For this personal website, I integrated all things relativly new to me, for practice.</p>
            <p>React CRA, Functional components + Hooks, css modules, scss, WebGL, WSL Ubuntu, npm, Docker, Heroku...</p>
            <p>For some technologies, I only did "learning by doing" in my former projects to catch the deadline; for some technologies I just finished online courses or school projects so I need more practice.</p>      
            <p>Yeah, my WebGL effect might superficial and time wasted, but whatever, office time is for routine tasks, personal time is for fun. I had fun.</p>
            <p>(BTW, this shining effect is from Kenji Saito's Codepen)</p>


        </div>
    );
}

