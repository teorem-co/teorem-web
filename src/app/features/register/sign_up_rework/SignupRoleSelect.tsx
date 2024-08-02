import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import logo from '../../../../assets/images/teorem_logo_purple.png';
import { resetSignUp } from '../../../store/slices/signUpSlice';
import { PATHS } from '../../../routes';
import { t } from 'i18next';
import { RoleOptions, setSelectedCountryState, setSelectedRole } from '../../../store/slices/roleSlice';
import Select, { SingleValue } from 'react-select';
import { useLazyGetCountriesQuery } from '../../onboarding/services/countryService';
import { Option } from '../../my-profile/VideoRecorder/VideoRecorder';

export const SignupRoleSelect = () => {
    const IMAGES_PATH = '/images';

    const dispatch = useDispatch();
    const history = useHistory();
    const PARENT = RoleOptions.Parent;
    const TUTOR = RoleOptions.Tutor;
    const STUDENT = RoleOptions.Student;

    async function setRoleInStore(role: RoleOptions) {
        await dispatch(setSelectedRole(role));
        history.push(PATHS.REGISTER);
    }

    useEffect(() => {
        dispatch(resetSignUp());
        setCountryInStore(selectedCountry);
    }, []);

    function setCountryInStore(country: string) {
        dispatch(setSelectedCountryState(country));
    }

    const [getCountries] = useLazyGetCountriesQuery();

    const [countryOptions, setCountryOptions] = useState<Option[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const handleChangeCountry = (selectedOption: SingleValue<Option>) => {
        const selectedValue = selectedOption ? selectedOption.value : '';
        setSelectedCountry(selectedValue);
        dispatch(setSelectedCountryState(selectedValue));
    };

    async function fetchCountries() {
        const res = await getCountries().unwrap();
        const countries = res.map((country) => {
            return {
                value: country.id,
                label: country.name,
            };
        });

        const userCountry = await getUserCountry();
        let country;
        if (userCountry !== null) {
            country = res.filter((country) => country.abrv === userCountry)[0]?.id;
        } else {
            country = res[0]?.id;
        }
        setCountryOptions(countries);
        setSelectedCountry(country);
        dispatch(setSelectedCountryState(country));
    }

    const getUserCountry = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data.country;
        } catch (error) {
            console.error('Error fetching user country:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <>
            <div>
                <img src={logo} alt="logo" className="mt-5 ml-5 signup-logo" />

                <div className="flex flex--col mt-20 flex--center" style={{ fontSize: '16px' }}>
                    <div className="flex flex--center timezone-container flex--gap-10">
                        <span className="text-align--center mt-5 mb-5 signup-title">{t('ONBOARDING.COUNTRY_SELECT')}</span>
                        <Select
                            className={'w--156'}
                            classNamePrefix="select"
                            value={countryOptions.find((option) => option.value === selectedCountry)}
                            onChange={handleChangeCountry}
                            options={countryOptions}
                            placeholder={t('COUNTRY.PLACEHOLDER')}
                        />
                    </div>

                    <h1 className="text-align--center mt-5 mb-5 signup-title">
                        <span dangerouslySetInnerHTML={{ __html: t('REGISTER.FORM.SELECT_ROLE_TITLE') }} />
                    </h1>

                    <div
                        className="flex  flex--row"
                        style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        {/*parent*/}
                        <div
                            onClick={() => setRoleInStore(PARENT)}
                            className="flex--col card--primary scale-hover--scale-105 cur--pointer"
                            style={{
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img className="card-role-select" style={{ padding: '15%' }} src={`${IMAGES_PATH}/parent.svg`} alt="parent" />
                            <p className="text-align--center">{t('ROLE_SELECTION.PARENT_TITLE')}</p>
                        </div>

                        {/*student*/}
                        <div
                            onClick={() => setRoleInStore(STUDENT)}
                            className="flex--col card--primary scale-hover--scale-105 cur--pointer"
                            style={{
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img className="card-role-select" style={{ padding: '15%' }} src={`${IMAGES_PATH}/student.svg`} alt="parent" />
                            <p className="text-align--center">{t('ROLE_SELECTION.STUDENT_TITLE')}</p>
                        </div>
                    </div>

                    {/*tutor*/}
                    <div onClick={() => setRoleInStore(TUTOR)} className="text-align--center">
                        <h3 className="mt-5 cur--pointer underline-hover primary-color ">{t('REGISTER.FORM.BECOME_A_TUTOR')}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};
