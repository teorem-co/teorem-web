import { useCallback, useEffect } from 'react';

interface Props {
    children: JSX.Element | JSX.Element[];
    sideBarIsOpen: boolean;
    title: string;
    closeSidebar: () => void;
    onSubmit: () => void;
    onCancel?: () => void;
    submitLabel: string;
    cancelLabel: string;
}

const Sidebar = (props: Props) => {
    const { sideBarIsOpen, title, children, closeSidebar, onSubmit, onCancel, submitLabel, cancelLabel } = props;

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            //Do whatever when esc is pressed
            closeSidebar();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);

        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, []);

    return (
        <div className="pos--abs">
            <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>

            <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{title}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">{children}</div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--clear type--wgt--bold" onClick={onSubmit}>
                            {submitLabel}
                        </button>
                        <button className="btn btn--clear type--color--error type--wgt--bold" onClick={onCancel ? onCancel : closeSidebar}>
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
