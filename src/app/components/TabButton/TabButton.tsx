import { Button, ButtonProps } from '@mui/material';
import clsx from 'clsx';
import styles from './TabButton.module.scss';

interface ITabButtonProps extends ButtonProps {
    active?: boolean;
}

export default function TabButton({ active, ...otherProps }: Readonly<ITabButtonProps>) {
    return <Button className={clsx(styles.button, { [styles.active]: active })} {...otherProps} />;
}
