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
        },
        {
            label: 'Croatian',
            value: 'hr-HR',
            path: 'hr',
        },
        {
            label: 'Polish',
            value: 'en-US',
            path: 'en',
        },
    ];

    return (
        <>
            <div className="modal__overlay"></div>
            <div className="modal modal--language" style={{ height: 'auto' }}>
                <div className="flex flex--col flex--jc--space-evenly flex--center h--200--min">
                    <div className="type-md">{t('LANGUAGE_MODAL.WELCOME')}</div>
                    <div className="type-md">{t('LANGUAGE_MODAL.ABOUT')}</div>

                    <div ref={languageRef} className={`language`} onClick={() => setIsActive(!isActive)}>
                        <i className="icon icon--base icon--language icon--grey"></i>
                        <span className="language__label">{selectLanguage}</span>

                        {isActive && (
                            <div className="language__dropdown">
                                {countryOptions.map((option: ILanguageOption) => {
                                    return (
                                        <div key={option.value} className="language__dropdown__item" onClick={() => handleChange(option)}>
                                            {option.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LanguageModal;
