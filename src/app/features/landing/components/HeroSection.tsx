import React from 'react';

import firstAvatar from '../../../../assets/images/user-avatar-1.png';
import secondAvatar from '../../../../assets/images/user-avatar-2.png';
import thirdAvatar from '../../../../assets/images/user-avatar-3.png';
import fourthAvatar from '../../../../assets/images/user-avatar-4.png';
import fifthAvatar from '../../../../assets/images/user-avatar-5.png';

interface Props {
    title: string;
    desc: string;
    showBtn: boolean;
}

const HeroSection = (props: Props) => {
    const { title, desc, showBtn } = props;

    return (
        <div className="landing__hero">
            <div className="landing__hero__title landing--fluid--title">{title}</div>
            <div className="landing__hero__subtitle landing--fluid--sm type--color--secondary">{desc}</div>
            {showBtn ? <button className="btn btn--primary btn--lg mt-10">Try for free</button> : <></>}
            <div className="landing__avatar landing__avatar--first">
                <img src={firstAvatar} alt="user-1" />
            </div>
            <div className="landing__avatar landing__avatar--second">
                <img src={secondAvatar} alt="user-2" />
            </div>
            <div className="landing__avatar landing__avatar--third">
                <img src={thirdAvatar} alt="user-3" />
            </div>
            <div className="landing__avatar landing__avatar--fourth">
                <img src={fourthAvatar} alt="user-4" />
            </div>
            <div className="landing__avatar landing__avatar--fifth">
                <img src={fifthAvatar} alt="user-5" />
            </div>
        </div>
    );
};

export default HeroSection;
