import { t } from 'i18next';
import { ButtonPrimaryGradient } from './ButtonPrimaryGradient';

interface Props {
    skip: () => void;
    start: () => void;
    title: string;
    body: string;
}

export const TutorialModal = (props: Props) => {
    const { skip, start, title, body } = props;

    return (
        <>
            <div className="modal__overlay">
                <div className="modal flex flex--col flex--ai--center flex--jc--space-between w--550 h--200 dash-border ">
                    <h2 className="pt-1">{title}</h2>
                    <span>{body}</span>
                    <div className="flex flex--row flex--jc--center pb-1 w--100 pl-10 pr-10">
                        <ButtonPrimaryGradient className="btn btn--lg" onClick={start}>
                            {t('TUTOR_INTRO.MODAL.BUTTON_START')}
                        </ButtonPrimaryGradient>
                    </div>
                    <div
                        className="icon icon--grey icon--md icon--close"
                        onClick={skip}
                        style={{ position: 'absolute', top: '5px', right: '5px' }}
                    ></div>
                </div>
            </div>
        </>
    );
};
