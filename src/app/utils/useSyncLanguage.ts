import { matchPath, useHistory } from 'react-router-dom';
import languageOptions from '../constants/languageOptions';
import { setSelectedLang } from '../store/slices/langSlice';
import { useCallback } from 'react';
import { setLoginModalOpen } from '../store/slices/modalsSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import IUser from '../types/IUser';

export default function useSyncLanguage() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [t, i18n] = useTranslation();
    const { languages } = useAppSelector((state) => state.lang);

    const match = '/:lang(' + Array.from(languageOptions.map((l) => l.path)).join('|') + ')';

    const sync = useCallback(
        (user: IUser | null) => {
            if (
                matchPath(location.pathname, {
                    path: match,
                })
            ) {
                //finds the lang from url and from the user and resolves them by priority
                const urlLang = matchPath(location.pathname, {
                    path: match,
                })?.params.lang;
                const userLang = languages.find((l) => l.id === user?.languageId);
                const resolvedLang = userLang?.abrv.toLowerCase() ?? urlLang;

                // sets the lang in the document and in the store
                document.documentElement.lang = resolvedLang;
                dispatch(setSelectedLang({ name: resolvedLang, abrv: resolvedLang, id: '' }));

                // updates the url if needed
                if (i18n.language !== resolvedLang) {
                    i18n.changeLanguage(resolvedLang);
                    const targetLocation = location.pathname.replace(urlLang, resolvedLang);
                    console.log(targetLocation);
                    window.location.href = targetLocation;

                    return;
                }
            } else {
                // block probably never reachable, left here because i didn't have the time to test it
                const lang = i18n.languages[i18n.languages.length - 1];
                i18n.changeLanguage(lang);
                dispatch(setSelectedLang({ name: lang, abrv: lang, id: '' }));

                location.pathname.length > 1
                    ? history.push(`/${lang}${location.pathname}${location.search ?? ''}`)
                    : dispatch(setLoginModalOpen(true));
            }
        },
        [dispatch, history, i18n, languages, match]
    );

    return sync;
}
