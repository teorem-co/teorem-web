import React from 'react';
import { NavLink } from 'react-router-dom';

import testImg from '../../../../assets/images/hero-img.png';
import logo from '../../../../assets/images/logo.svg';
import { LANDING_PATHS } from '../../../routes';

const Footer = () => {
    return (
        <div className="landing__footer landing__section">
            {/* Content */}
            <div className="flex--grow landing__footer__content mt-10">
                <NavLink
                    className="landing__footer__logo d--b flex--shrink  mb-10"
                    to={LANDING_PATHS.HOW_IT_WORKS}
                >
                    <img src={logo} alt="logo" />
                </NavLink>
                <div className="type--md type--color--white mb-10">
                    If you have additional questions, feel free to contact us
                    via email info@teorem.hr
                </div>

                <div className="type--color--white type--left flex">
                    <div>
                        <div className="type--wgt--bold">Teorem d.o.o.</div>
                        <div>
                            Address 69, Zagreb +385 1 3434 620 info@teorem.hr
                        </div>
                    </div>
                    <div className="pl-10">
                        <div className="type--wgt--bold">About Teorem</div>
                        <div>Legal notice Privacy policy Become a tutor</div>
                    </div>
                    <div className="pl-10">
                        <div className="type--wgt--bold">Načini plaćanja</div>
                        <div>Lorem ipsum dolor sit amet</div>
                        <div>KARTICE</div>
                    </div>
                </div>
                <div className="mt-10">
                    <span className="type--color--white">
                        &#169; Teorem 2021
                    </span>
                </div>
            </div>
            {/* Side image  */}

            {/* Test div with some width */}
            <img className="landing__footer__img" src={testImg} alt="test" />
        </div>
    );
};

export default Footer;
