import React from 'react';

import Footer from './Footer';
import HeroSection from './HeroSection';
import Navigation from './Navigation';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const LandingWrapper = (props: Props) => {
    const { children } = props;

    return (
        <>
            <div className="landing">
                {/* NAVIGATION */}
                <Navigation />
                {/* HERO  */}
                <div className="landing__content">
                    <HeroSection />
                    {children}
                </div>
            </div>
            {/* FOOTER */}
            <Footer />
        </>
    );
};

export default LandingWrapper;
