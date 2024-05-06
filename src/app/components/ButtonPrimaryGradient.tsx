import { ButtonHTMLAttributes, useState } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
    children?: React.ReactNode;
}

export const ButtonPrimaryGradient = (props: Props) => {
    const { title, children, type, className, ...restOfProps } = props;
    const [gradient, setGradient] = useState('#7e6cf2');

    const handleMouseMove = (e: any) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setGradient(`radial-gradient(circle at ${x}% ${y}%, rgba(127, 95, 211, 0.9), #5c3ee8)`);
    };

    const handleMouseLeave = () => {
        setGradient('#7e6cf2');
    };

    return (
        <>
            <button
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ background: gradient }}
                className={`btn btn--primary ${className}`}
                type={type}
                {...restOfProps}
            >
                {/*use children as text*/}

                {children || title}
            </button>
        </>
    );
};
