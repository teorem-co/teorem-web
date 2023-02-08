interface IProps {
    initials: string;
    imageBig?: boolean;
}

const ImageCircle: React.FC<IProps> = (props) => {
    const { initials, imageBig } = props;
    return (
        <div
            className={`image ${
                imageBig ? 'image--big' : ''
            } flex flex--center flex--jc--center`}
        >
            <div className="image__initial">{initials}</div>
        </div>
    );
};

export default ImageCircle;
