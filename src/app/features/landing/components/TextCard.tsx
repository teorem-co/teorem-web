import React from 'react';

interface Props {
    title: string;
    desc: string;
    className?: string;
}

const TextCard = (props: Props) => {
    const { title, desc, className } = props;

    return (
        <div className={`landing__text-card ${className ? className : ''}`}>
            <h1 className="landing__text-card__title mb-4">{title}</h1>
            <p className="landing__text-card__description type--color--secondary landing--fluid--sm">{desc}</p>
        </div>
    );
};

export default TextCard;
