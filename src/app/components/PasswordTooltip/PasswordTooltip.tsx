import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import styles from './PasswordTooltip.module.scss';
import clsx from 'clsx';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
    passTooltip: boolean;
    positionTop?: boolean;
    className?: string;
    conditions: {
        lowercase: boolean;
        uppercase: boolean;
        number: boolean;
        special: boolean;
        length: number;
        includesEmail: boolean;
        includesName: boolean;
    };
}

export default function PasswordTooltip(props: Props) {
    const { conditions } = props;
    const { t } = useTranslation();

    if (conditions.length === 0) return null;

    return (
        <div>
            {conditions.includesEmail ? (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon, styles.red)} /> {t('FORM_VALIDATION.EMAIL_IN_PASSWORD')}
                </div>
            ) : null}
            {conditions.includesName ? (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon)} /> {t('FORM_VALIDATION.NAME_IN_PASSWORD')}
                </div>
            ) : null}
            {!conditions.includesEmail && !conditions.includesName ? (
                <div className={clsx(styles.green)}>
                    <CheckCircleIcon className={clsx(styles.icon, styles.green)} /> {t('FORM_VALIDATION.NAME_EMAIL_NOT_IN_PASSWORD')}
                </div>
            ) : null}
            {conditions.length >= 8 ? null : (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon)} /> {t('FORM_VALIDATION.MIN_CHARACTERS')}
                </div>
            )}
            {conditions.lowercase ? null : (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon)} /> {t('FORM_VALIDATION.LOWERCASE')}
                </div>
            )}
            {conditions.uppercase ? null : (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon)} /> {t('FORM_VALIDATION.UPPERCASE')}
                </div>
            )}
            {conditions.special ? null : (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon)} /> {t('FORM_VALIDATION.SPECIAL_CHAR')}
                </div>
            )}
            {conditions.number ? null : (
                <div className={clsx(styles.red)}>
                    <CancelIcon className={clsx(styles.icon, styles.red)} /> {t('FORM_VALIDATION.NUMBER')}
                </div>
            )}
        </div>
    );
}
