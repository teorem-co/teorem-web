import { useTranslation } from 'react-i18next';
import styles from './TutorCard.module.scss';

interface ITutorCardProps {
    image?: string;
    name?: string;
    price?: string;
    education?: string;
    subjects?: string[];
}

export default function TutorCard({ image, name, price, education, subjects }: Readonly<ITutorCardProps>) {
    const [t] = useTranslation();

    return (
        <div className={styles.card}>
            <img className={styles.image} src={image} alt={name} />
            <div>
                <h6 className={styles.name}>{name}</h6>
                <p className={styles.price}>{price}</p>
            </div>
            <div>{education}</div>
            <div className={styles.subjects}>{subjects?.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
    );
}
