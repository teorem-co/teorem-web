import ContentLoader from 'react-content-loader';

const LoaderAvailableLessons = () => (
    <div className="mt-6">
        <ContentLoader
            className="w--100"
            speed={2}
            width={305}
            height={400}
            viewBox="0 0 305 400"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="4" ry="4" width="305" height="88" />
            <rect x="0" y="104" rx="4" ry="4" width="305" height="88" />
            <rect x="0" y="208" rx="4" ry="4" width="305" height="88" />
            <rect x="0" y="312" rx="4" ry="4" width="305" height="88" />
        </ContentLoader>
    </div>
);

export default LoaderAvailableLessons;
