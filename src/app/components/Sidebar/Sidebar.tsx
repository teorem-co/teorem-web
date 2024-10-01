import { ReactNode, useCallback, useEffect } from 'react';
import styles from './Sidebar.module.scss';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '../Divider';

interface ISidebarProps {
    children?: ReactNode;
    sideBarIsOpen?: boolean;
    title?: string;
    closeSidebar?: () => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
}

export default function Sidebar({
    sideBarIsOpen,
    title,
    children,
    closeSidebar,
    onSubmit,
    onCancel,
    submitLabel,
    cancelLabel,
}: ISidebarProps) {
    const escFunction = useCallback(
        (event) => {
            if (event.keyCode === 27) {
                //Do whatever when esc is pressed
                closeSidebar?.();
            }
        },
        [closeSidebar]
    );

    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);

        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, [escFunction]);

    return (
        <div className="pos--abs">
            <div
                className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`}
                onClick={closeSidebar}
            ></div>

            <div
                className={`sidebar sidebar--secondary sidebar--secondary ${
                    !sideBarIsOpen ? 'sidebar--secondary--close' : ''
                }`}
            >
                <div className={styles.header}>
                    {title ? (
                        <Typography className={styles.title} variant="h5" component="h2" fontWeight="bold">
                            {title}
                        </Typography>
                    ) : null}
                    <IconButton size="small" className={styles.close} onClick={(e: any) => closeSidebar?.()}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className="flex--grow">{children}</div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        {onSubmit ? (
                            <button className="btn btn--clear type--wgt--bold" onClick={onSubmit}>
                                {submitLabel}
                            </button>
                        ) : null}
                        {onCancel || closeSidebar ? (
                            <button
                                className="btn btn--clear type--color--error type--wgt--bold"
                                onClick={onCancel ? onCancel : closeSidebar}
                            >
                                {cancelLabel}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
