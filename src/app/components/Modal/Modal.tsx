import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MuiModal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Modal.module.scss';
import { useEffect } from 'react';
import Divider from '../Divider';

interface IModalProps {
    open: boolean;
    onClose?: (e: any, reason: string) => void;
    onBackdropClick?: (e: any) => void;
    backdropClickDisabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

export default function Modal({ open, onClose, onBackdropClick, backdropClickDisabled, children, title }: Readonly<IModalProps>) {
    useEffect(() => {
        const html = document.getElementsByTagName('html')[0];
        if (html) {
            if (open) {
                html.style.overflow = 'hidden';
            } else {
                html.style.overflow = 'auto';
            }
        }

        () => {
            if (html) {
                html.style.overflow = 'auto';
            }
        };
    }, [open]);

    return (
        <MuiModal
            open={open}
            onClose={(e: any, reason: any) => {
                if (reason === 'backdropClick' && !backdropClickDisabled) {
                    return onBackdropClick?.(e);
                }
                onClose?.(e, reason);
            }}
        >
            <div className={styles.container}>
                {title ? (
                    <>
                        <div className={styles.header}>
                            <Typography className={styles.title} variant="h5" component="h2" fontWeight="bold">
                                {title}
                            </Typography>
                            {onClose ? (
                                <IconButton size="small" className={styles.close} onClick={(e: any) => onClose(e, '')}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            ) : null}
                        </div>
                        <Divider />
                    </>
                ) : null}
                <div className={styles.children}>{children}</div>
            </div>
        </MuiModal>
    );
}
