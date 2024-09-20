import styles from './PublishPoint.module.scss';

interface IPublishPointProps {
    icon: string;
    title: string;
    description: string;
}

export default function PublishPoint({ icon, title, description }: Readonly<IPublishPointProps>) {
    return (
        <div className={styles.point}>
            <img className={styles.img} src={icon} alt={title} />
            <div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}
