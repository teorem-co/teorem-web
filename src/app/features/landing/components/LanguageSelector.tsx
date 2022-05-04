import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { OptionType } from '../../../components/form/MySelectField';
import languageOptions from '../../../constants/languageOptions';
import { LANDING_PATHS, PATHS } from '../../../routes';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';

interface Props {
    onTop: boolean;
}

const LanguageSelector = (props: Props) => {
    const { onTop } = props;

    const [isActive, setIsActive] = useState<boolean>(false);
    const { t, i18n } = useTranslation();

    const history = useHistory();
    const languageRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(languageRef, () => setIsActive(false));

    const currentLanguage = languageOptions.find((item) => item.value === i18n.language) || languageOptions[0];
    const [activeOption, setActiveOption] = useState<OptionType>(currentLanguage);

    const handleChange = (option: OptionType) => {
        if (option.value !== i18n.language) {
            setActiveOption(option);
            
            let pushPath = '';
            Object.values(LANDING_PATHS).forEach( path => {
                if(t(path) === history.location.pathname) pushPath = path;
            });

            i18n.changeLanguage(option.value);
            history.push(t(pushPath));
            window.location.reload();
        }
    };

    return (
        <div
            ref={languageRef}
            className={`language ${onTop && history.location.pathname === t(LANDING_PATHS.PRICING) && 'language--primary'}`}
            onClick={() => setIsActive(!isActive)}
        >
            <i className="icon icon--base icon--language icon--grey"></i>
            <span className="language__label">{activeOption.label.substring(0, 3)}</span>

            {isActive && (
                <div className="language__dropdown">
                    {languageOptions.map((option: OptionType) => {
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
