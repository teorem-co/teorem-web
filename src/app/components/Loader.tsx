import React from 'react';
import ContentLoader from 'react-content-loader';

const Loader = () => (
    <ContentLoader
        speed={2}
        width={'100%'}
        height={240}
        viewBox="0 0 1399 240"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <circle cx="114" cy="118" r="79" />
        <circle cx="114" cy="118" r="68" />
        <rect x="1065" y="39" rx="4" ry="4" width="129" height="23" />
        <rect x="1065" y="73" rx="4" ry="4" width="129" height="23" />
        <rect x="1065" y="165" rx="4" ry="4" width="195" height="28" />
        <rect x="252" y="39" rx="4" ry="4" width="132" height="24" />
        <rect x="252" y="70" rx="4" ry="4" width="222" height="21" />
        <rect x="252" y="162" rx="4" ry="4" width="62" height="19" />
        <rect x="321" y="162" rx="4" ry="4" width="62" height="19" />
        <rect x="252" y="113" rx="4" ry="4" width="377" height="28" />
    </ContentLoader>
);

export default Loader;
