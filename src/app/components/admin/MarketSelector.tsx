import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCountry } from '../../store/slices/countryMarketSlice';
import { useAppSelector } from '../../store/hooks';
import { CiShop } from 'react-icons/ci';
import { t } from 'i18next';
import ICountry from '../../../types/ICountry';

const MarketSelector = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const countriesState = useAppSelector((state) => state.countryMarket);
    const dispatch = useDispatch();
    const languageRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (option: ICountry) => {
        dispatch(setSelectedCountry(option));
        window.location.reload();
    };

    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    return (
        <div
            ref={languageRef}
            className={`language type--base`}
            onClick={() => {
                setIsActive(!isActive);
            }}
            onMouseEnter={() => {
                if (!isMobile) {
                    setIsActive(true);
                }
            }}
            onMouseLeave={() => {
                setIsActive(false);
            }}
        >
            <CiShop className={isMobile ? 'icon--base' : 'icon--md'} size={100} />
            <span className="language__label">
                {t('COUNTRY.' + countriesState.selectedCountry?.abrv.toUpperCase())}
            </span>
            {isActive && (
                <div className="language__dropdown" style={isMobile ? { bottom: 'calc(100%)' } : { top: 'calc(100%)' }}>
                    {countriesState.countries.map((option: ICountry) => {
                        return (
                            <div
                                key={option.id}
                                className="language__dropdown__item"
                                onClick={() => changeLanguage(option)}
                            >
                                {t('COUNTRY.' + option.abrv.toUpperCase())}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MarketSelector;
