
interface Props{
  handleClose: () => void;
  roomLink: string;
}

export const HiLinkModalForTutorIntro = (props: Props) => {
  const {handleClose, roomLink} = props;


  return (
    <>
      <div className="iframe-modal">
        <img src='/logo-purple-text.png' alt='' className="pos--abs ml-2 mt-5 iframe-logo" height='40px'/>
        <i className="icon icon--base icon--close modal__close cur--pointer mt-2 mr-2" onClick={handleClose}></i>
          <iframe style={{ width: '100%', height:'100%' }} id="frame" src={roomLink!} allow="camera;microphone;display-capture"></iframe>
      </div>
    </>
  );
};
