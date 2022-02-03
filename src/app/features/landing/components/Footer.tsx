import React from 'react';
import { NavLink } from 'react-router-dom';

import ipad from '../../../../assets/images/ipad-hand-hold.png';
import logo from '../../../../assets/images/logo.svg';
import { LANDING_PATHS } from '../../../routes';

const Footer = () => {
    return (
        <div className="landing__footer">
            <div className="landing__footer__content">
                <NavLink
                    className="landing__navigation__logo d--b flex--shrink mt-10"
                    to={LANDING_PATHS.HOW_IT_WORKS}
                >
                    <img src={logo} alt="logo" />
                </NavLink>
                <div className="type--color--white mt-10">
                    If you have additional questions, feel free to contact us
                    via email info@teorem.hr
                </div>
                <div className="flex flex--wrap w--100 type--color--white ">
                    <div className="mr-10">
                        <div className="type--wgt--bold mt-8">
                            Teorem d.o.o.
                        </div>
                        <div>Address 69, Zagreb</div>
                        <div> +385 1 3434 620</div>
                        <div>info@teorem.hr</div>
                    </div>
                    <div className="mr-10">
                        <div className="type--wgt--bold mt-8">About Teorem</div>
                        <div>Legal notice </div>
                        <div> Privacy policy </div>
                        <div> Become a tutor</div>
                    </div>
                    <div className="">
                        <div className="type--wgt--bold mt-8">
                            Načini plaćanja
                        </div>
                        <div>Lorem ipsum dolor sit amet</div>
                        <div>KARTICE</div>
                    </div>
                </div>
                <div className="mt-10 mb-4">
                    <span className="type--color--white">
                        &#169; Teorem 2021
                    </span>
                </div>
            </div>
            <div className="landing__footer__img">
                <img src={ipad} alt="footer-photo" />
            </div>
        </div>
    );
};

export default Footer;
