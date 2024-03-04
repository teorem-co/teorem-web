import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    text: string;
    hide: () => void;
    redirectionPath?: string;
}

export const Banner = (props: Props) => {
    const { text, hide, redirectionPath } = props;

    return (
        <div
            className="banner flex flex--row flex--jc--center flex--ai--center p-1"
            style={{
                color: 'white',
                backgroundColor: 'rgba(126, 108, 242, 1)',
                position: 'absolute',
                width: '100%',
                top: 0,
                zIndex: 100,
            }}
        >
            {redirectionPath ? (
                <NavLink to={redirectionPath} className="ml-6 align-self-center type--wgt--bold type--color--white">
                    {text}
                </NavLink>
            ) : (
                <p> {text}</p>
            )}
            <i onClick={hide} style={{ right: 0, position: 'absolute' }} className="icon icon--sm icon--close icon--grey"></i>
        </div>
    );
};
