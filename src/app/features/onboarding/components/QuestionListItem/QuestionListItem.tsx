import clsx from 'clsx';
import styles from './QuestionListItem.module.scss';

interface IQuestionListItemProps {
    title: string;
    image?: string;
    link: string;
    description: string;
}

export default function QuestionListItem({ title, image, link, description }: IQuestionListItemProps) {
    return (
        <a
            className={clsx(styles.link, { [styles.withImage]: image })}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
        >
            {image ? <img className={styles.image} src={image} alt={title} /> : null}
            <div className={styles.body}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.description}>{description}</p>
            </div>
        </a>
    );
}
