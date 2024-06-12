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
    !isMobile ? (
        <div
          className='banner flex  flex--ai--center p-5'
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
              <NavLink
                className='ml-6 mr-5 type--start type--wgt--bold type--color--white align-self-end'
                to={redirectionPath}>
                <button className={'btn btn--base btn--secondary'} onClick={hide}>
                  {buttonText}
                </button>
              </NavLink>
            )}

            <i
              className='icon mobile-icon icon--base icon--close icon--grey m-4 '
              onClick={hide}
              style={{
                // right: '15px',
                position: 'absolute',
              }}
            ></i>
          </div>
        </div>)
      :
      (
        <div
          className='banner flex  flex--ai--center p-3'
          style={{
            color: 'white',
            borderBottom: '1px solid white',
            backgroundColor: 'rgba(126, 108, 242, 1)',
            width: '100%',
            top: 0,
            position: 'relative',
          }}
        >
          <div className={'flex flex--row flex--jc--space-between mb-2'}>

            <p className={'type--normal text-align--justify w--80'}> {text}</p>
            <i
              className='icon mobile-icon icon--md icon--close icon--grey m-4 '
              onClick={hide}
            ></i>
          </div>
          {redirectionPath && (
            <NavLink
              className='type--start type--wgt--bold type--color--white align-self-end align--center w--80'
              to={redirectionPath}>
              <button className={'btn btn--base btn--secondary w--100'}
                      onClick={hide}>
                {buttonText}
              </button>
            </NavLink>
          )}
        </div>)
  );
};
