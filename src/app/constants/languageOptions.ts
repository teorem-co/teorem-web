//import { OptionType } from '../components/form/MySelectField';

export interface ILanguageOption {
    label: string;
    value: string;
    path: string;
}

const languageOptions: ILanguageOption[] = [
    {
        label: 'English',
        value: 'en-US',
        path: 'en',
    },
    {
        label: 'Hrvatski',
        value: 'hr-HR',
        path: 'hr',
    },
];

export default languageOptions;
