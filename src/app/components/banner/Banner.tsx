import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

interface Props {
    text: string;
    hide: () => void;
    redirectionPath?: string;
    buttonText?: string;
    showTooltip?: boolean;
    tooltipText?: string;
}

export const Banner = (props: Props) => {
    const { text, hide, redirectionPath, buttonText, showTooltip, tooltipText } = props;
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
            <div data-tooltip-id={'leave-review'} data-tooltip-content={tooltipText} data-tooltip-float>
                <p className={'type--normal'}> {text}</p>
            </div>
            <div className={'flex--row flex  flex--center mr-5 banner'}>
                {redirectionPath && (
                    <NavLink className="ml-6 mr-5 type--start type--wgt--bold type--color--white align-self-end" to={redirectionPath}>
                        <button className={'btn btn--base btn--secondary'} onClick={hide}>
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
            <Tooltip id={`leave-review`} place="right-end" hidden={!showTooltip} />
        </div>
    );
};
