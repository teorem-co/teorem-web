import React from 'react';
import ContentLoader from 'react-content-loader';

const LoaderTutor = () => (
    <div className="flex--primary p-6">
        <ContentLoader
            className="mr-6"
            speed={2}
            width={594}
            height={157}
            viewBox="0 0 594 157"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <circle cx="79" cy="79" r="79" />
            <circle cx="79" cy="79" r="68" />
            <rect x="217" y="0" rx="4" ry="4" width="132" height="24" />
            <rect x="217" y="31" rx="4" ry="4" width="222" height="21" />
            <rect x="217" y="123" rx="4" ry="4" width="62" height="19" />
            <rect x="286" y="123" rx="4" ry="4" width="62" height="19" />
            <rect x="217" y="74" rx="4" ry="4" width="377" height="28" />
        </ContentLoader>
        <ContentLoader
            speed={2}
            width={195}
            height={154}
            viewBox="0 0 195 154"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="4" ry="4" width="129" height="23" />
            <rect x="0" y="34" rx="4" ry="4" width="129" height="23" />
            <rect x="0" y="126" rx="4" ry="4" width="195" height="28" />
        </ContentLoader>
    </div>
);

export default LoaderTutor;
