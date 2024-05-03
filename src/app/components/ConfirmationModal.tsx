interface Props {
    title: string;
    description?: string;
    confirmButtonTitle: string;
    cancelButtonTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal = (props: Props) => {
    const { title, cancelButtonTitle, confirmButtonTitle, onConfirm, onCancel, description } = props;

    return (
        <>
            <div className="modal__overlay">
                <div className="modal flex flex--col flex--ai--center flex--jc--space-between dash-border confirm-modal">
                    <h2 className="type--md mb-4 type--center">{title}</h2>
                    {description && <span className="type--sm mb-4 type--center">{description}</span>}
                    <div className="flex flex--row flex--jc--space-between flex--gap-10">
                        <button className="btn confirm-modal-button btn--error--primary " onClick={onConfirm}>
                            {confirmButtonTitle}
                        </button>
                        <button className="btn  confirm-modal-button" onClick={onCancel}>
                            {cancelButtonTitle}
                        </button>
                    </div>
                    <i
                        className="icon icon--grey icon--base icon--close"
                        onClick={onCancel}
                        style={{ position: 'absolute', top: '5px', right: '5px' }}
                    ></i>
                </div>
            </div>
        </>
    );
};
