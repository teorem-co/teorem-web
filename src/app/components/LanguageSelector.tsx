import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { LiaLanguageSolid } from 'react-icons/lia';
import useOutsideAlerter from '../utils/useOutsideAlerter';
import languageOptions, { ILanguageOption } from '../constants/languageOptions';
import ROUTES, { PROFILE_PATHS } from '../routes';

interface Props {
  onTop: boolean;
  className?: string;
  color?: string;
}

interface MyRoute {
  path: string;
  key: string;
  exact: boolean;
  lang: string;
  component: React.ComponentType;
}

const LanguageSelector = (props: Props) => {
  const { onTop, className, color } = props;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [t, i18n] = useTranslation();

  const history = useHistory();
  const languageRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(languageRef, () => setIsActive(false));

  const handleChange = (option: ILanguageOption) => {
    if (option.path === i18n.language) return;
    const curr = ROUTES.find((route: MyRoute) => route.path === window.location.pathname);
    if (curr == undefined) return;
    let newOne = ROUTES.find((route: MyRoute) => route.key == curr.key && route.lang == option.path);
    if (newOne == undefined) newOne = curr;

    history.push(newOne.path);
    i18n.changeLanguage(option.path);
  };

  const changeLanguage = (option: ILanguageOption) => {
    let pushPath = '';

    Object.keys(PROFILE_PATHS).forEach((path) => {
      if (t('PATHS.PROFILE_PATHS.' + path) === history.location.pathname) {
        pushPath = 'PATHS.PROFILE_PATHS.' + path;
      }
    });

    i18n.changeLanguage(option.path);

    history.push(t(pushPath));
    window.location.reload();
  };

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <div
      ref={languageRef}
      className={`${className} language`}
      onClick={() => {
        setIsActive(!isActive);
      }}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsActive(true);
        }
      }}
      onMouseLeave={() => {
        setIsActive(false);
      }}
    >
      <LiaLanguageSolid color={color ? color : 'gray'}
                        className={isMobile ? 'icon--base' : 'icon--md'}
                        size={100} />
      <span className='language__label'>{i18n.language.toUpperCase()}</span>

      {isActive && (
        <div className='language__dropdown'
             style={isMobile ? { bottom: 'calc(100%)' } : { top: 'calc(100%)' }}>
          {languageOptions.map((option: ILanguageOption) => {
            return (
              <div key={option.value} className='language__dropdown__item'
                   onClick={() => changeLanguage(option)}>
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
