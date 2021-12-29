import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
    const [asideActive, setAsideActive] = useState<boolean>(false);

    return (
        <>
            <div className="layout">
                <div className="layout__mobile">
                    <div>Theorem</div>
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
                        <i className="icon icon--sm icon--close--white"></i>
                    </div>

                    <Navbar />
                </div>
                <div className="layout__main">{props.children}</div>
            </div>
        </>
    );
};

export default MainWrapper;
