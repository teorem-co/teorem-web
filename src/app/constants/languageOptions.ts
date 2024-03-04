//import { OptionType } from '../components/form/MySelectField';

export interface ILanguageOption {
    label: string;
    value: string;
    path: string;
}

const languageOptions: ILanguageOption[] = [
    {
        label: 'ENGLISH',
        value: 'en-US',
        path: 'en',
    },
    {
        label: 'HRVATSKI',
        value: 'hr-HR',
        path: 'hr',
    },
];

export default languageOptions;
