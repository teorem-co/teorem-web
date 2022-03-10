import React from 'react';

import calendar from '../../../../assets/images/landing_calendar.jpg';
import firstAvatar from '../../../../assets/images/user-avatar-1.png';
import secondAvatar from '../../../../assets/images/user-avatar-2.png';
import thirdAvatar from '../../../../assets/images/user-avatar-3.png';
import fourthAvatar from '../../../../assets/images/user-avatar-4.png';
import fifthAvatar from '../../../../assets/images/user-avatar-5.png';
import FAQGroup from '../components/FAQGroup';
import ImageSlider from '../components/ImageSlider';
import LandingWrapper from '../components/LandingWrapper';
import ReviewCard from '../components/ReviewCard';
import TextCard from '../components/TextCard';
import grid1 from './../../../../assets/images/grid1.jpg';
import grid2 from './../../../../assets/images/grid2.jpg';
import grid3 from './../../../../assets/images/grid3.jpg';
import grid4 from './../../../../assets/images/grid4.jpg';
import grid5 from './../../../../assets/images/grid5.jpg';
import grid6 from './../../../../assets/images/grid6.jpg';
import profileIllustration3 from './../../../../assets/images/profile-illustration3.jpg';

const BecomeTutor = () => {
    return (
        <LandingWrapper>
            {/* Content */}

            <div className="landing__hero">
                <div className="landing__hero__title landing--fluid--title w--550--max">Start tutoring online</div>
                <div className="landing__hero__subtitle landing--fluid--sm type--color--secondary w--260--max">
                    Give lessons whenever you want, from the comfort of your home.
                </div>
                <button className="btn btn--primary btn--lg mt-10">Try for free</button>
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
            <div className="landing__section mt-30">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <TextCard
                className="mt-30"
                title="Teorem’s online tutoring makes your life easier"
                desc="We’ll provide you with everything you need to teach online. We help you find students and manage lessons."
            />
            <div className="mt-30">
                <div className="row row--adaptive">
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid1} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Fully remote</div>
                            <div className="type--color--tertiary">All you need is a laptop and wifi</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid2} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Tools you need</div>
                            <div className="type--color--tertiary">Booking system, chat, video calls & more.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid3} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Secure Income</div>
                            <div className="type--color--tertiary">We make sure you get paid.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid4} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Set Your Price</div>
                            <div className="type--color--tertiary">No limitations on what you can earn.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid5} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">24/7 Support</div>
                            <div className="type--color--tertiary">We make sure all your issues are solved.</div>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="landing__grid__card">
                            <img className="mb-10" src={grid6} alt="grid" />
                            <div className="type--lg type--wgt--bold mb-4">Improve Your Teaching</div>
                            <div className="type--color--tertiary">We take care of administration, you just focus on the lessons.</div>
                        </div>
                    </div>
                </div>
            </div>
            <ReviewCard className="mt-30" img={profileIllustration3} />

            <TextCard
                className="mt-30"
                title="Set your own price and availability!"
                desc="Use our tools to track how much you’re making and increase your client base!"
            />
            <div className="landing__section mt-30">
                <img src={calendar} alt="calendar" className="landing__img" />
            </div>
            <p className="landing__title">We are here to help you grow!</p>
            <ReviewCard className="mt-30" img={profileIllustration3} />
            <p className="landing__title">How to become an online tutor on Teorem</p>
            <div className="mt-20">
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">1</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Create your account and fill in the information.</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item">2</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Upload a short video to prove your identity.</div>
                </div>
                <div className="flex flex--jc--start">
                    <div className="landing__steps__item last">3</div>
                    <div className="mt-5 ml-6 type--color--secondary type--md">Complete your profile and start tutoring!</div>
                </div>
            </div>
            <div className="landing__section mt-30">
                <button className="btn btn--primary btn--lg type--md">Get started</button>
            </div>
            <p className="landing__title">Frequently asked questions</p>
            <FAQGroup />
        </LandingWrapper>
    );
};

export default BecomeTutor;
