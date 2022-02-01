import moment from 'moment';

export const getDateAgoLabel = (dateCreated: string) => {
    const today = moment(new Date());
    const dateToCompare = moment(dateCreated);

    const daysDiff = today.diff(dateToCompare, 'days');
    const weekDiff = today.diff(dateToCompare, 'week');
    const monthsDiff = today.diff(dateToCompare, 'months');
    const yearsDiff = today.diff(dateToCompare, 'years');

    if (yearsDiff !== 0) {
        return `${yearsDiff} years ago`;
    }

    if (monthsDiff !== 0) {
        return `${monthsDiff} months ago`;
    }

    if (weekDiff !== 0) {
        return `${weekDiff} weeks ago`;
    }

    return `${daysDiff} days ago`;
};
