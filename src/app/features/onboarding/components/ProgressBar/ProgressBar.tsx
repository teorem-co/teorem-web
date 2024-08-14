import styles from './ProgressBar.module.scss';

interface IProgressBarProps {
    step?: number;
    maxStep: number;
}

export default function ProgressBar({ step, maxStep }: IProgressBarProps) {
    return (
        <div className={styles.bar}>
            <span
                style={{ width: step ? `calc((${step < maxStep ? step : maxStep}/${maxStep})* 100%)` : '0px' }}
                className={styles.progress}
            />
            <span className={styles.divider} /> <span className={styles.divider} />
        </div>
    );
}
