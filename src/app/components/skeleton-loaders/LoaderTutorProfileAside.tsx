import React from 'react';
import ContentLoader from 'react-content-loader';

const LoaderTutorProfileAside = () => {
    return (
        <div className="card--primary p-4 pt-6">
            <ContentLoader speed={2} width={'100%'} viewBox="0 0 272 423" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <rect opacity="0.8" y="378" width="272" height="45" rx="4" fill="#BDBDBD" />
                <rect x="42" y="175" width="188" height="21" fill="#EDEDED" />
                <circle cx="136" cy="64" r="64" fill="#EDEDED" />
                <circle opacity="0.5" cx="136" cy="64" r="56" fill="#BDBDBD" />
                <rect x="93" y="144" width="87" height="27" fill="#BDBDBD" />
            </ContentLoader>
        </div>
    );
};

export default LoaderTutorProfileAside;
