import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
    const { t } = useTranslation();
    const [asideActive, setAsideActive] = useState<boolean>(false);

    return (
        <>
            <div className="layout">
                <div className="layout__mobile">
                    <div>{t('MAIN_TITLE')}</div>
                    <i className="icon icon--md icon--menu icon--white" onClick={() => setAsideActive(!asideActive)}>
                        hamburger
                    </i>
                </div>
                <div className={`sidebar layout__aside ${asideActive ? 'active' : ''}`}>
                    <div className="layout__aside__close sidebar__close" onClick={() => setAsideActive(!asideActive)}>
                        <i className="icon icon--md icon--close icon--black"></i>
                    </div>
                    <Navbar />
                </div>
                <div className="layout__main">{props.children}</div>
            </div>
        </>
    );
};

export default MainWrapper;
