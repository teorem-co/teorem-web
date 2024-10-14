import { CheckoutInfoCard } from './CheckoutInfoCard';
import React from 'react';
import { useLocation } from 'react-router';

const CheckoutInfoCardWrapper: React.FC = () => {
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const tutorId = searchParams.get('tutorId') || '';
    const startTime = searchParams.get('startTime') || '';

    return tutorId && startTime ? (
        <div className="flex flex--jc--center flex--ai--center flex--grow p-4">
            <CheckoutInfoCard className="w--400" startTime={startTime} tutorId={tutorId} />
        </div>
    ) : (
        <div>SOMETING WENT WRONG</div>
    );
};

export default CheckoutInfoCardWrapper;
