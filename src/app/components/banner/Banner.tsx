import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    text: string;
    hide: () => void;
    redirectionPath?: string;
    buttonText?: string;
}

export const Banner = (props: Props) => {
    const { text, hide, redirectionPath, buttonText } = props;
    const isMobile = window.innerWidth < 776;

    return (
        <div
            className="banner flex  flex--ai--center p-5"
            style={{
                color: 'white',
                borderBottom: '1px solid white',
                backgroundColor: 'rgba(126, 108, 242, 1)',
                width: '100%',
                top: 0,
                position: 'relative',
            }}
        >
            <p className={'type--normal'}> {text}</p>
            <div className={'flex--row flex  flex--center mr-5 banner'}>
                {redirectionPath && (
                    <NavLink to={redirectionPath} className="ml-6 mr-5 type--start type--wgt--bold type--color--white align-self-end">
                        <button onClick={hide} className={'btn btn--base btn--secondary'}>
                            {buttonText}
                        </button>
                    </NavLink>
                )}

                <i
                    className="icon mobile-icon icon--base icon--close icon--grey m-4 "
                    onClick={hide}
                    style={{
                        // right: '15px',
                        position: 'absolute',
                    }}
                ></i>
            </div>
        </div>
    );
};
