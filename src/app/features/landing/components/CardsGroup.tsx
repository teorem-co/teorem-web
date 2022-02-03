import React from 'react';

import diners from '../../../../assets/images/diners-club.png';
import maestro from '../../../../assets/images/maestro.png';
import mastercard from '../../../../assets/images/mastercard.png';
import stripe from '../../../../assets/images/stripe.png';
import visa from '../../../../assets/images/visa.png';

const CardsGroup = () => {
    return (
        <div className="landing__cards">
            <div className="landing__cards__item">
                <img src={stripe} alt="stripe" />
            </div>
            <div className="landing__cards__item">
                <img src={visa} alt="visa" />
            </div>
            <div className="landing__cards__item">
                <img src={mastercard} alt="mastercard" />
            </div>
            <div className="landing__cards__item">
                <img src={diners} alt="diners" />
            </div>
            <div className="landing__cards__item">
                <img src={maestro} alt="maestro" />
            </div>
        </div>
    );
};

export default CardsGroup;
