import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { INavLink } from '../../interfaces/INavLink';
import Navbar from './Navbar';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
    const { t } = useTranslation();
    const [asideActive, setAsideActive] = useState<boolean>(false);

    const testLinks: INavLink[] = [
        {
            path: '/my-bookings',
            name: 'My Bookings',
            icon: 'calendar',
        },
        {
            path: '/role-selection',
            name: 'Chat',
            icon: 'chat',
        },
        {
            path: '/',
            name: 'Reviews',
            icon: 'reviews',
        },
    ];

    return (
        <>
            <div className="layout">
                <div className="layout__mobile">
                    <div>{t('MAIN_TITLE')}</div>
                    <i
                        className="icon icon--md icon--menu icon--white"
                        onClick={() => setAsideActive(!asideActive)}
                    >
                        hamburger
                    </i>
                </div>
                <div
                    className={`sidebar layout__aside ${
                        asideActive ? 'active' : ''
                    }`}
                >
                    <div
                        className="layout__aside__close sidebar__close"
                        onClick={() => setAsideActive(!asideActive)}
                    >
                        <i className="icon icon--sm icon--close icon--black"></i>
                    </div>

                    <Navbar navLinks={testLinks} />
                </div>
                <div className="layout__main">{props.children}</div>
            </div>
        </>
    );
};

export default MainWrapper;
