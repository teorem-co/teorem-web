import styles from './Divider.module.scss';
import clsx from 'clsx';

interface DividerProps {
    className?: string;
}

export default function Divider({ className }: DividerProps) {
    return <div className={clsx(styles.divider, className)} />;
}
