import { CheckoutInfoCard } from './CheckoutInfoCard';
import React from 'react';
import { useLocation } from 'react-router';
import { CheckoutInfoCardMobile } from './CheckoutInfoCardMobile';

const CheckoutInfoCardWrapper: React.FC = () => {
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const tutorId = searchParams.get('tutorId') || '';
    const startTime = searchParams.get('startTime') || '';
    const isMobile = window.innerWidth < 766;

    return tutorId && startTime ? (
        isMobile ? (
            <div className="p-4 w--100 h--100dvh bg__white">
                <CheckoutInfoCardMobile startTime={startTime} tutorId={tutorId} />
            </div>
        ) : (
            <div className="bg__white">
                <img
                    src="/logo-purple-text.png"
                    alt=""
                    className="align-self-start ml-4 mt-4 bg__white w-100"
                    style={{ height: '25px' }}
                />
                <div className="flex flex--1 flex--col flex--jc--center flex--ai--center flex--grow p-4 h--100dvh bg__white">
                    <CheckoutInfoCard className="w--400" startTime={startTime} tutorId={tutorId} />
                </div>
            </div>
        )
    ) : (
        <div>SOMETING WENT WRONG</div>
    );
};

export default CheckoutInfoCardWrapper;
