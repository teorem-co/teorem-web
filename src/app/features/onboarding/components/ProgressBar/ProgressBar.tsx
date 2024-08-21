import clsx from 'clsx';
import styles from './ProgressBar.module.scss';

interface IProgressBarProps {
    step?: number;
    substep?: number;
    maxSubstep?: number;
}

export default function ProgressBar({ step = 1, substep = 0, maxSubstep = 1 }: Readonly<IProgressBarProps>) {
    return (
        <div className={styles.bar}>
            <span className={clsx(styles.step, { [styles.filled]: step > 1 })}>
                <span
                    className={styles.progress}
                    style={{
                        width:
                            substep && step === 1
                                ? `calc((${substep < (maxSubstep || 1) ? substep : maxSubstep}/${maxSubstep})* 100%)`
                                : '0px',
                    }}
                />
            </span>
            <span className={clsx(styles.step, { [styles.filled]: step > 2 })}>
                <span
                    className={styles.progress}
                    style={{
                        width:
                            substep && step === 2
                                ? `calc((${substep < (maxSubstep || 1) ? substep : maxSubstep}/${maxSubstep})* 100%)`
                                : '0px',
                    }}
                />
            </span>
            <span className={clsx(styles.step, { [styles.filled]: step > 3 })}>
                <span
                    className={styles.progress}
                    style={{
                        width:
                            substep && step === 3
                                ? `calc((${substep < (maxSubstep || 1) ? substep : maxSubstep}/${maxSubstep})* 100%)`
                                : '0px',
                    }}
                />
            </span>
        </div>
    );
}
