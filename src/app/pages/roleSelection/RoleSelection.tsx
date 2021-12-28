import logo from './../../../assets/images/logo.png';
import gradientCircle from './../../../assets/images/gradient-circle.svg';
import { RoleSelectionEnum, roleSelectionOptions } from '../../constants/roleSelectionOptions';
import IRoleSelectionOption from '../../../interfaces/IRoleSelectionOption';
import heroImg from '../../../assets/images/hero-img.png';
import { useEffect, useState } from 'react';

interface Props { }

const RoleSelection: React.FC<Props> = (props) => {
    //const { } = props;

    return <>
        <div className="role-selection">
            <div className="role-selection__aside">
                <img src={heroImg} alt="Hero Img" />
            </div>
            <div className="role-selection__content">
                <div className="mb-22"><img src={logo} alt="Theorem" /></div>
                <div className="type--lg type--wgt--bold mb-4">Register</div>
                <div className="mb-2">I want to register as a</div>
                <div className="role-selection__form">
                    {
                        roleSelectionOptions.map((roleOption: IRoleSelectionOption) => {
                            return <div className="role-selection__item" key={roleOption.id} onClick={() => alert(roleOption.id + ' - ' + roleOption.title)}>
                                <img src={gradientCircle} alt="gradient circle" />
                                <div className="flex--grow ml-4">
                                    <div className="mb-1">{roleOption.title}</div>
                                    <div className="type--color--secondary">{roleOption.description}</div>
                                </div>
                                <i className="icon icon--base icon--arrow-right icon--primary"></i>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}

export default RoleSelection;