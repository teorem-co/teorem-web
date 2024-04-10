// no reviews, new tutor
import React, { useEffect, useState } from 'react';
import { t } from 'i18next';

interface Props {
    fontSize?: 'small' | 'base' | 'large';
}

export const NoReviews = (props: Props) => {
    const { fontSize } = { ...props };
    const [titleSize, setTitleSize] = useState('md');
    const [subtitleSize, setSubtitleSize] = useState('sm');

    useEffect(() => {
        if (fontSize === 'small') {
            setTitleSize('sm');
            setSubtitleSize('xs');
        } else if (fontSize === 'large') {
            setTitleSize('lg');
            setSubtitleSize('md');
        }
    }, []);

    return (
        <div className="flex flex--col flex--ai--center">
            <span className={`type--${titleSize} type--wgt--extra-bold`}>{t('SEARCH_TUTORS.NEW_TUTOR.PART_1')}</span>
            <span className={`type--${subtitleSize}`}>{t('SEARCH_TUTORS.NEW_TUTOR.PART_2')}</span>
        </div>
    );
};
