import { useTranslation } from 'react-i18next';
import styles from './TutorCard.module.scss';
import { ReactNode } from 'react';

interface ITutorCardProps {
    image?: string;
    name?: string;
    price?: string;
    education?: string;
    subjects?: string[];
    currency?: string;
    actions?: ReactNode;
}

export default function TutorCard({
    image,
    name,
    price,
    education,
    subjects,
    currency,
    actions,
}: Readonly<ITutorCardProps>) {
    const [t] = useTranslation();

    return (
        <div className={styles.card}>
            {actions ? <div className={styles.actions}>{actions}</div> : null}
            {image?.length ? <img className={styles.image} src={image} alt={name} /> : null}
            {name?.length || price?.length ? (
                <div className={styles.nameContainer}>
                    <p className={styles.name}>
                        <strong>{name}</strong>
                    </p>
                    <p className={styles.price}>
                        <strong>
                            {currency ?? t('CURRENCY.USD')}
                            {price}
                        </strong>{' '}
                        {t('TUTOR_CARD.LESSON')}
                    </p>
                </div>
            ) : null}
            {education ? <div>{education}</div> : null}
            {subjects?.length ? (
                <div className={styles.subjects}>{subjects?.map((s) => <span key={s}>{s}</span>)}</div>
            ) : null}
        </div>
    );
}
