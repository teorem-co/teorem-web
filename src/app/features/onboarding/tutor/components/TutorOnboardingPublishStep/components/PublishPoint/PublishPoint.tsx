import { ReactNode } from 'react';
import styles from './PublishPoint.module.scss';

interface IPublishPointProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function PublishPoint({ icon, title, description }: Readonly<IPublishPointProps>) {
    return (
        <div className={styles.point}>
            <div className={styles.img}>{icon}</div>
            <div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}
