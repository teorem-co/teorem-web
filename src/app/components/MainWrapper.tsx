import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';
import { debounce } from 'lodash';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { setTopOffset } from '../../slices/scrollSlice';
import { RoleOptions } from '../../slices/roleSlice';
import { DocumentVerificationBanner } from './banner/DocumentVerificationBanner';
import { Banner } from './banner/Banner';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
    const state = useAppSelector((state) => state.scroll);
    const topOffset = useAppSelector((state) => state.scroll.topOffset);
    const loggedInUser = useAppSelector((state) => state.auth.user);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [asideActive, setAsideActive] = useState<boolean>(false);

    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);
    const [hideBanner, setHideBanner] = useState<string | null>(null);
    const [hideStripeBanner, setHideStripeBanner] = useState<string | null>(null);

    const handleScroll = async (e: HTMLDivElement) => {
        if (e.scrollTop) dispatch(setTopOffset(e.scrollTop));
    };

    useEffect(() => {
        setHideBanner(sessionStorage.getItem('hideApprovedBanner'));
        setHideStripeBanner(sessionStorage.getItem('hideStripeBanner'));
    }, []);

    function hide() {
        setHideBanner('true');
        sessionStorage.setItem('hideApprovedBanner', 'true');
    }

    return (
        <>
            <div className="flex flex--col whole-page-layout">
                {!hideBanner && userRole === RoleOptions.Tutor && profileProgressState && !profileProgressState.verified && (
                    <Banner text={t(`TUTOR_VERIFIED_NOTE.TITLE`) + t(`TUTOR_VERIFIED_NOTE.DESCRIPTION`)} hide={hide} />
                )}
                {userRole === RoleOptions.Tutor && !hideStripeBanner && <DocumentVerificationBanner hideBanner={setHideStripeBanner} />}

                <div className="layout">
                    <div className="layout__mobile">
                        {/*<div className="flex flex--row flex--ai--center">*/}
                        <img src="/logo.svg" alt="" className="" style={{ height: '20px' }} />
                        {/*</div>*/}
                        <i className="icon icon--md icon--menu icon--black" onClick={() => setAsideActive(!asideActive)}>
                            hamburger
                        </i>
                    </div>
                    <div className={`sidebar layout__aside ${asideActive ? 'active' : ''}`}>
                        <div className="layout__aside__close sidebar__close" onClick={() => setAsideActive(!asideActive)}>
                            <i className="icon icon--md icon--close icon--black"></i>
                        </div>
                        <div className="font">
                            <Navbar />
                        </div>
                    </div>
                    <div id="main_layout" className="layout__main" onScroll={(e) => debouncedScrollHandler(e.target)}>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainWrapper;
