interface Props {
    full?: boolean;
}

const LoaderSecondary = (props: Props) => {
    const { full } = props;
    return (
        <div className="loader--cover">
            <div className={`loader--primary ${full ? 'loader--primary--fh' : ''}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoaderSecondary;
