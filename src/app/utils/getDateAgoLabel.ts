import { t } from 'i18next';
import moment from 'moment';

export const getDateAgoLabel = (dateCreated: string) => {
    const today = moment(new Date());
    const dateToCompare = moment(dateCreated);

    const daysDiff = today.diff(dateToCompare, 'days');
    const weekDiff = today.diff(dateToCompare, 'week');
    const monthsDiff = today.diff(dateToCompare, 'months');
    const yearsDiff = today.diff(dateToCompare, 'years');

    if (yearsDiff !== 0) {
        return `${t('MY_REVIEWS.DATE_AGO.BEFORE')} ${yearsDiff} ${t('MY_REVIEWS.DATE_AGO.YEARS')}`;
    }

    if (monthsDiff !== 0) {
        return `${t('MY_REVIEWS.DATE_AGO.BEFORE')} ${monthsDiff === 1 ? monthsDiff + t('MY_REVIEWS.DATE_AGO.MONTH') : monthsDiff + t('MY_REVIEWS.DATE_AGO.MONTH')} `;
    }

    if (weekDiff !== 0) {
        return `${t('MY_REVIEWS.DATE_AGO.BEFORE')} ${weekDiff === 1 ? weekDiff + t('MY_REVIEWS.DATE_AGO.WEEK') : weekDiff + t('MY_REVIEWS.DATE_AGO.WEEKS')}`;
    }

    return `${daysDiff === 0 ? t('MY_REVIEWS.DATE_AGO.TODAY') : daysDiff === 1 ? t('MY_REVIEWS.DATE_AGO.BEFORE') + daysDiff + t('MY_REVIEWS.DATE_AGO.DAY') : t('MY_REVIEWS.DATE_AGO.BEFORE') + daysDiff + t('MY_REVIEWS.DATE_AGO.DAYS')}`;

    /*
    if (yearsDiff !== 0) {
        return `${yearsDiff} years ago`;
    }

    if (monthsDiff !== 0) {
        return `${monthsDiff === 1 ? monthsDiff + ' month ago' : monthsDiff + ' months ago'} `;
    }

    if (weekDiff !== 0) {
        return `${weekDiff === 1 ? weekDiff + ' week ago' : weekDiff + ' weeks ago'}`;
    }

    return `${daysDiff === 0 ? 'Today' : daysDiff === 1 ? daysDiff + ' day ago' : daysDiff + ' days ago'}`;
    */
};
