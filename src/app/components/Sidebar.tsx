interface Props {
    children: JSX.Element | JSX.Element[];
    sideBarIsOpen: boolean;
    title: string;
    closeSidebar: () => void;
    onSubmit: () => void;
    submitLabel: string;
    cancelLabel: string;
}

const Sidebar = (props: Props) => {
    const {
        sideBarIsOpen,
        title,
        children,
        closeSidebar,
        onSubmit,
        submitLabel,
        cancelLabel,
    } = props;

    return (
        <div>
            <div
                className={`sidebar__overlay ${
                    !sideBarIsOpen ? 'sidebar__overlay--close' : ''
                }`}
            ></div>

            <div
                className={`sidebar sidebar--secondary sidebar--secondary ${
                    !sideBarIsOpen ? 'sidebar--secondary--close' : ''
                }`}
            >
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{title}</div>
                    <div>
                        <i
                            className="icon icon--base icon--close icon--grey"
                            onClick={closeSidebar}
                        ></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">{children}</div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--clear type--wgt--bold">
                            {submitLabel}
                        </button>
                        <button className="btn btn--clear type--color--error type--wgt--bold">
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
