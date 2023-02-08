import React from 'react';

import diners from '../../../../assets/images/diners-club.png';
import jl from '../../../../assets/images/jl.png';
import maestro from '../../../../assets/images/maestro.png';
import mastercard from '../../../../assets/images/mastercard.png';
import stripe from '../../../../assets/images/stripe.png';
import techCrunch from '../../../../assets/images/tech-crunch.png';
import theNextWeb from '../../../../assets/images/the-next-web.png';
import trustPilot from '../../../../assets/images/trustpilot.png';
import unitedNations from '../../../../assets/images/united-nations.png';
import visa from '../../../../assets/images/visa.png';
import useWindowSize from '../../../utils/useWindowSize';

interface Props {
    showCreditCards: boolean;
}

const CardsGroup = (props: Props) => {
    const { showCreditCards } = props;

    return showCreditCards ? (
        <div className={`landing__cards ${useWindowSize().width > 900 ? '' : 'mobile'} mt-10`}>
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
    ) : (
        <div className={`landing__cards ${useWindowSize().width > 900 ? '' : 'mobile'} mt-10`}>
            <div className="landing__cards__item">
                <img src={unitedNations} alt="un" />
            </div>
            <div className="landing__cards__item">
                <img src={techCrunch} alt="tc" />
            </div>
            <div className="landing__cards__item">
                <img src={theNextWeb} alt="tnw" />
            </div>
            <div className="landing__cards__item">
                <img src={trustPilot} alt="tp" />
            </div>
            <div className="landing__cards__item">
                <img src={jl} alt="jl" />
            </div>
        </div>
    );
};

export default CardsGroup;
