import ContentLoader from 'react-content-loader';

const LoaderLessonCard = () => (
    <div>
        <div className="flex--primary mb-10">
            <div>
                <ContentLoader speed={2} width={253} height={80} viewBox="0 0 253 80" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                    <path d="M 96 14 h 117 v 22 H 96 z" />
                    <path d="M 96 45 h 157 v 21 H 96 z" />
                    <circle cx="40" cy="40" r="40" />
                    <circle cx="40" cy="40" r="35" />
                </ContentLoader>
            </div>
            <div>
                <ContentLoader speed={2} width={366} height={46} viewBox="0 0 366 46" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                    <path d="M 0 12 h 117 v 22 H 0 z" />
                    <rect x="126" y="0" rx="4" ry="4" width="240" height="46" />
                </ContentLoader>
            </div>
        </div>
        <div className="loader--lesson-card">
            <div className="row">
                <div className="col col-12 col-lg-6">
                    <ContentLoader
                        speed={2}
                        width={386}
                        height={80}
                        viewBox="0 0 386 80"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                        className="w--100 mb-6"
                    >
                        <rect x="1" y="1" rx="5" ry="5" width="385" height="79" />
                    </ContentLoader>
                </div>
                <div className="col col-12 col-lg-6">
                    <ContentLoader
                        speed={2}
                        width={386}
                        height={80}
                        viewBox="0 0 386 80"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                        className="w--100"
                    >
                        <rect x="1" y="1" rx="5" ry="5" width="385" height="79" />
                    </ContentLoader>
                </div>
                <div className="col col-12 col-lg-6">
                    <ContentLoader
                        speed={2}
                        width={386}
                        height={80}
                        viewBox="0 0 386 80"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                        className="w--100"
                    >
                        <rect x="1" y="1" rx="5" ry="5" width="385" height="79" />
                    </ContentLoader>
                </div>
            </div>
        </div>
    </div>
);

export default LoaderLessonCard;
