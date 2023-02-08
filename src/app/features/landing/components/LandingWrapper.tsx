import React from 'react';

import { useAppSelector } from '../../../hooks';
import Footer from './Footer';
import LanguageModal from './LanguageModal';
import Navigation from './Navigation';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const LandingWrapper = (props: Props) => {
    const { children } = props;
    const lang = useAppSelector((state) => state.lang.lang);

    return (
        <>
            {/* NAVIGATION */}
            <Navigation />
            {/* LOCALE SELECTOR */}
            {!lang && <LanguageModal />}
            <div className="landing">
                <div className="landing__content">{children}</div>
            </div>
            {/* FOOTER */}
            <Footer />
        </>
    );
};

export default LandingWrapper;
