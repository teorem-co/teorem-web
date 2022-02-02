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
                <HeroSection />
                {children}
            </div>
            {/* FOOTER */}
            <Footer />
        </>
    );
};

export default LandingWrapper;
