import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { setLang } from '../../../../slices/langSlice';
import languageOptions, { ILanguageOption } from '../../../constants/languageOptions';
import { useAppDispatch } from '../../../hooks';
import { LANDING_PATHS } from '../../../routes';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';
import LanguageSelector from './LanguageSelector';

const LanguageModal = () => {
    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [selectLanguage, setSelectLanguage] = useState<string>('International');
    const [t, i18n] = useTranslation();

    const history = useHistory();
    const languageRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(languageRef, () => setIsActive(false));

    const handleChange = (option: ILanguageOption) => {
        if (option.value !== i18n.language) {
            let pushPath = '';
            Object.keys(LANDING_PATHS).forEach((path) => {
                if (t('PATHS.LANDING_PATHS.' + path) === history.location.pathname) pushPath = 'PATHS.LANDING_PATHS.' + path;
            });
            i18n.changeLanguage(option.path);
            setSelectLanguage(option.label);
            dispatch(setLang(option.path));
            history.push(t(pushPath));
            window.location.reload();
        }
    };

    const countryOptions = [
        {
            label: 'International',
            value: 'en-US',
            path: 'en',
            short: 'EN',
        },
        {
            label: 'Croatian',
            value: 'hr-HR',
            path: 'hr',
            short: 'HR',
            flag: '🇭🇷'
        },
        {
            label: 'Polish',
            value: 'en-US',
            path: 'en',
            short: 'PL',
            flag: '🇵🇱'
        },
    ];

    return (
        <>
            <div className="modal__overlay modal--language--overlay"></div>
            <div className="modal modal--language" style={{ height: 'auto' }}>
                <div className="flex flex--col flex--jc--space-evenly flex--center h--200--min">
                    <div className="type--lg mt-3 mb-1">{t('LANGUAGE_MODAL.WELCOME')}</div>
                    <div className="type--color--secondary type-md mb-1">{t('LANGUAGE_MODAL.ABOUT')}</div>

                    <div onClick={() => setIsActive(!isActive)}>
                        <div className="flex flex--center flex--col mt-6">
                            {countryOptions.map((option: any) => {
                                return (
                                    <div
                                        key={option.short}
                                        className={`btn btn--${
                                            option.short === 'EN' ? 'ghost' : 'ghost--grey'
                                        } w--350 mb-4 p-3 flex flex--center flex--jc--space-between`}
                                        onClick={() => handleChange(option)}
                                    >
                                        <div className="flex flex--center">
                                            <div className={`image flex flex--center flex--jc--center`}>
                                                {option.short === 'EN' ? (
                                                    <i className="icon icon--base icon--language icon--primary"></i>
                                                ) : (
                                                    // option.short.toUpperCase()
                                                    <span style={{fontSize: 20}}>{option.flag}</span>
                                                )}
                                            </div>
                                            <div className="ml-3">{option.label}</div>
                                        </div>
                                        <i className="icon icon--base icon--check icon--primary"></i>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LanguageModal;
