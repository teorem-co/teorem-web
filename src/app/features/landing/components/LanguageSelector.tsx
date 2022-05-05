import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import languageOptions, { ILanguageOption } from '../../../constants/languageOptions';
import { LANDING_PATHS } from '../../../routes';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';

interface Props {
    onTop: boolean;
}

const LanguageSelector = (props: Props) => {
    const { onTop } = props;

    const [isActive, setIsActive] = useState<boolean>(false);
    const [t, i18n] = useTranslation();

    const history = useHistory();
    const languageRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(languageRef, () => setIsActive(false));

    const currentLanguage = languageOptions.find((item) => item.value === i18n.language) || languageOptions[0];
    const [activeOption, setActiveOption] = useState<ILanguageOption>(currentLanguage);

    const handleChange = (option: ILanguageOption) => {




        if (option.value !== i18n.language) {
            setActiveOption(option);
            
            let pushPath = '';

            Object.keys(LANDING_PATHS).forEach( path => {
                if(t('PATHS.LANDING_PATHS.' + path) === history.location.pathname){
                    pushPath = 'PATHS.LANDING_PATHS.' + path;
                }
            });

            i18n.changeLanguage(option.path);

            history.push(t(pushPath));
            window.location.reload();
        }
    };


    return (
        <div
            ref={languageRef}
            className={`language ${onTop && history.location.pathname === LANDING_PATHS.PRICING && 'language--primary'}`}
            onClick={() => setIsActive(!isActive)}
        >
            <i className="icon icon--base icon--language icon--grey"></i>
            <span className="language__label">{i18n.language.toUpperCase()}</span>

            {isActive && (
                <div className="language__dropdown">
                    {languageOptions.map((option: ILanguageOption) => {
                        return (
                            <div key={option.value} className="language__dropdown__item" onClick={() => handleChange(option)}>
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
