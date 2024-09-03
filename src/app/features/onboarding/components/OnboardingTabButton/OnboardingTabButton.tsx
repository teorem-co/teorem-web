import clsx from 'clsx';
import TabButton, { ITabButtonProps } from '../../../../components/TabButton/TabButton';
import styles from './OnboardingTabButton.module.scss';
import Typography from '@mui/material/Typography';

interface IOnboardingTabButtonProps extends ITabButtonProps {
    image: string;
    title: string;
    subtitle: string;
}

export default function OnboardingTabButton({
    image,
    title,
    subtitle,
    className,
    ...otherProps
}: Readonly<IOnboardingTabButtonProps>) {
    return (
        <TabButton className={clsx(styles.button, className)} {...otherProps}>
            <div className={styles.buttonContent}>
                <div>
                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="body2">{subtitle}</Typography>
                </div>
                <img className={styles.image} src={image} alt={image} />
            </div>
        </TabButton>
    );
}
