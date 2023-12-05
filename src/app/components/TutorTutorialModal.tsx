import { t } from 'i18next';

interface Props{
  skip: () => void,
  start: () => void,
}


export const TutorTutorialModal = (props: Props) => {
  const {skip, start} = props;

  return (
    <>
    <div className='modal__overlay'>
      <div className='modal flex flex--col flex--ai--center flex--jc--space-between w--550 h--200 dash-border '>
        <h2 className='pt-1'>{t('TUTOR_INTRO.MODAL.TITLE')}</h2>
        <span>{t('TUTOR_INTRO.MODAL.BODY')}</span>
        <div className='flex flex--row flex--jc--center pb-1 w--100 pl-10 pr-10'>
          <button className='btn btn--lg btn--primary' onClick={start}>{t('TUTOR_INTRO.MODAL.BUTTON_START')}</button>
        </div>
        <div className="icon icon--grey icon--md icon--close" onClick={skip} style={{position:'absolute', top:'5px', right:'5px'}}></div>
        </div>
    </div>
    </>
  );
};
