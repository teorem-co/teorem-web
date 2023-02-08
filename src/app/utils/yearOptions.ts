import moment from 'moment';

import { OptionType } from '../components/form/MySelectField';

export const calcYears = () => {
    const firstYear = 2022;
    const currentYear = Number(moment().format('YYYY'));

    const yearsToMap = currentYear - firstYear + 1;

    const yearOptions: OptionType[] = [];

    for (let i = 0; i < yearsToMap; i++) {
        const yearToPush = (firstYear + i).toString();
        const currentObj: OptionType = {
            label: yearToPush,
            value: yearToPush,
        };
        yearOptions.push(currentObj);
    }

    return yearOptions;
};

export default calcYears;
