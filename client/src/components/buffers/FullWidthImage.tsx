import React from 'react';

const FullWidthImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    return (
        <div
            style={{
                height: '30vh',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            aria-label={alt}
        />
    );
};

export default FullWidthImage;