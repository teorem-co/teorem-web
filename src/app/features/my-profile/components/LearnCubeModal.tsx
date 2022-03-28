interface Props {
    handleClose: () => void;
}

const LearnCubeModal = (props: Props) => {
    const { handleClose } = props;

    return (
        <>
            <div className="modal__overlay">
                <div className="modal modal--stripe">
                    <i className="icon icon--base icon--close modal__close" onClick={handleClose}></i>

                    <div className="modal__body">
                        {/* {loading && <LoaderPrimary />} */}
                        {
                            <iframe
                                style={{ width: '100%' }}
                                id="frame"
                                src={'https://app.learncube.com/vc/room/class-na-reroot-545375-ypdiwvgtzxam/'}
                            ></iframe>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default LearnCubeModal;
