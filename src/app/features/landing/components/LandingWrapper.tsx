import React from 'react';

import Footer from './Footer';
import Navigation from './Navigation';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const LandingWrapper = (props: Props) => {
    const { children } = props;

    return (
        <>
            {/* NAVIGATION */}
            <Navigation />
            <div className="landing">
                <div className="landing__content">{children}</div>
            </div>
            {/* FOOTER */}
            <Footer />
        </>
    );
};

export default LandingWrapper;
