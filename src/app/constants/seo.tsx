import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { matchPath } from 'react-router-dom';

import { ROUTES } from '../routes';

export const SEO = () => {
    const routesWithData: string[] = ['HOW_IT_WORKS', 'PRICING', 'BECOME_TUTOR', 'TERMS', 'PRIVACY'];

    let currentRoute: any = ROUTES.find((route: any) => matchPath(location.pathname, route));

    if (typeof currentRoute === 'undefined' || !routesWithData.includes(currentRoute.key))
        currentRoute = {
            key: 'FALLBACK',
        };

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{t(`SEO.${currentRoute.key}.TITLE`)}</title>
            <meta name="description" content={t(`SEO.${currentRoute.key}.META`)} />
        </Helmet>
    );
};
