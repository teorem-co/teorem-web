import Button, { ButtonProps } from '@mui/material/Button';
import { useState } from 'react';
import styles from './CtaButton.module.scss';
import clsx from 'clsx';

export default function CtaButton({ sx, className, ...otherProps }: ButtonProps) {
    const [gradient, setGradient] = useState('#7e6cf2');

    const handleMouseMove = (e: any) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        if (x <= 1 || x >= 99 || y <= 1 || y >= 99) return;

        setGradient(`radial-gradient(circle at ${x}% ${y}%, rgba(127, 95, 211, 0.9), #5c3ee8)`);
    };

    const handleMouseLeave = () => {
        setGradient('#7e6cf2');
    };

    return (
        <Button
            variant="contained"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{ ...sx, background: gradient }}
            className={clsx(styles.button, className)}
            color="primary"
            {...otherProps}
        />
    );
}
