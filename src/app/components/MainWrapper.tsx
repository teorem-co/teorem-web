
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';
import { debounce } from 'lodash';
import ScrollContext from './ScrollContext';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { setStepOne } from '../../slices/signUpSlice';
import { setTopOffset } from '../../slices/scrollSlice';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';


interface Props {
    children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {

  const state = useAppSelector((state) => state.scroll);
  const topOffset = useAppSelector((state) => state.scroll.topOffset);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [asideActive, setAsideActive] = useState<boolean>(false);

  const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);

    const handleScroll = async (e: HTMLDivElement) => {
      console.log("setting state");
      if(e.scrollTop)
        dispatch(
          setTopOffset(e.scrollTop)
        );
    };

  return (
    const { t } = useTranslation();
    const [asideActive, setAsideActive] = useState<boolean>(false);

    return (
        <>
            <div className="layout">
                <div className="layout__mobile">
                    {/*<div className="flex flex--row flex--ai--center">*/}
                      <img src='/logo.svg' alt='' className="" style={{height:'20px'}}/>
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
                <div onScroll={(e) => debouncedScrollHandler(e.target)} className="layout__main">{props.children}</div>
        </>
    );
};

export default MainWrapper;
