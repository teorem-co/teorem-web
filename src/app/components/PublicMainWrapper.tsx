import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PublicNavbar from './PublicNavbar';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const PublicMainWrapper = (props: Props) => {
    const { t } = useTranslation();
    const [asideActive, setAsideActive] = useState<boolean>(false);

    return (
        <>
            <div className="layout">
                <div className="layout__mobile">
                    <div className="flex flex--row flex--ai--center">
                        <img src="/logo-white.svg" alt="" className="" style={{ height: '40px' }} />
                        <div className="font__lg">{t('MAIN_TITLE')}</div>
                    </div>
                    <i className="icon icon--md icon--menu icon--white" onClick={() => setAsideActive(!asideActive)}>
                        hamburger
                    </i>
                </div>
                <div className={`sidebar layout__aside ${asideActive ? 'active' : ''}`}>
                    <div className="layout__aside__close sidebar__close" onClick={() => setAsideActive(!asideActive)}>
                        <i className="icon icon--md icon--close icon--black"></i>
                    </div>
                    <PublicNavbar />
                </div>
                <div className="layout__main">{props.children}</div>
            </div>
        </>
    );
};

export default PublicMainWrapper;
