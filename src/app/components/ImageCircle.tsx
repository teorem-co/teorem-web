import { CSSProperties } from 'react';

interface IProps {
    initials: string;
    imageBig?: boolean;
    style?: CSSProperties;
    fontSize?: CSSProperties["fontSize"];
}

const ImageCircle: React.FC<IProps> = (props) => {
    const { initials, imageBig, style, fontSize } = props;
    return (
        <div
            className={`image ${
                imageBig ? 'image--big' : ''
            } flex flex--center flex--jc--center`}
            style={style}
        >
            <div className="image__initial" style={{fontSize: fontSize || ""}}>{initials}</div>
        </div>
    );
};

export default ImageCircle;
