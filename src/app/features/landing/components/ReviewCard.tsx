interface Props {
    className?: string;
    data: {
        text: string;
        name: string;
        role: string;
    };
    img: string;
}

const ReviewCard = (props: Props) => {
    const { className, img, data } = props;
    return (
        <div className={`landing__review-card ${className ? className : ''}`}>
            {/* User data */}
            <div>
                <div className=" flex--shrink">
                    <img src={img} className="mb-2" alt="user-avatar" />
                </div>
                <div className="flex flex--col flex--center">
                    <div className="type--color--white type--wgt--bold type--md mb-2">{data.name}</div>
                    <div className="type--sm type--color--half-transparent type--wgt--bold">{data.role}</div>
                </div>
            </div>
            {/* Review description */}
            <div className="type--color--white landing__review-card__description landing--fluid--sm">{data.text}</div>
        </div>
    );
};

export default ReviewCard;
