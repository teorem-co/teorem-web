interface Props {
    small?: boolean;
}

const LoaderPrimary = (props: Props) => {
    const { small } = props;
    return (
        <div className={`loader--primary ${small ? 'loader--primary--sm' : ''}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoaderPrimary;
