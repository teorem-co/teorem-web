import React from 'react';
import ContentLoader from 'react-content-loader';

import LoaderTutorProfileAside from './LoaderTutorProfileAside';

const LoaderTutorProfile = () => {
    return (
        <>
            <div>
                <div className="card--secondary card--secondary--alt">
                    <div className="card--secondary__head">
                        {' '}
                        <ContentLoader
                            speed={2}
                            width={100}
                            viewBox="0 0 155 36"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            className="mb-6"
                        >
                            <rect width="155" height="36" fill="#BDBDBD" />
                        </ContentLoader>
                    </div>
                    <div className="card--secondary__body">
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            viewBox="0 0 895 245"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <rect
                                y="29"
                                width="895"
                                height="63"
                                fill="#EDEDED"
                            />
                            <rect
                                y="161"
                                width="895"
                                height="84"
                                fill="#EDEDED"
                            />
                            <rect width="87" height="21" fill="#BDBDBD" />
                            <rect
                                x="1"
                                y="132"
                                width="127"
                                height="21"
                                fill="#BDBDBD"
                            />
                        </ContentLoader>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            viewBox="0 0 155 36"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            className="mb-6"
                        >
                            <rect width="155" height="36" fill="#BDBDBD" />
                        </ContentLoader>
                    </div>
                </div>
            </div>
            <div>
                <LoaderTutorProfileAside />
            </div>
        </>
    );
};

export default LoaderTutorProfile;
