import styles from './PublishStep.module.scss';

interface IPublishStepProps {
    icon: string;
    title: string;
    description: string;
}

export default function PublishStep({ icon, title, description }: Readonly<IPublishStepProps>) {
    return (
        <div className={styles.step}>
            <img className={styles.img} src={icon} alt={title} />
            <div>
                <h6 className={styles.title}>{title}</h6>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}
