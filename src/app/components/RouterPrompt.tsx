import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

interface Props {
    when: boolean;
    onOK: () => boolean;
    onCancel: () => boolean;
}

const RouterPrompt = (props: Props) => {
    const { when, onOK, onCancel } = props;

    const history = useHistory();

    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        if (when) {
            history.block((prompt) => {
                setCurrentPath(prompt.pathname);
                setShowPrompt(true);
                return 'true';
            });
        } else {
            history.block(() => {
                //comment prevents eslint unexpected empty arrow function error
            });
        }

        return () => {
            history.block(() => {
                //comment prevents eslint unexpected empty arrow function error
            });
        };
    }, [history, when]);

    const handleOK = useCallback(async () => {
        if (onOK) {
            const canRoute = await Promise.resolve(onOK());

            if (canRoute) {
                history.block(() => {
                    //comment prevents eslint unexpected empty arrow function error
                });
                history.push(currentPath);
            }
        }
    }, [currentPath, history, onOK]);

    const handleCancel = useCallback(async () => {
        if (onCancel) {
            const canRoute = await Promise.resolve(onCancel());
            if (canRoute) {
                history.block(() => {
                    //comment prevents eslint unexpected empty arrow function error
                });
                history.push(currentPath);
            }
        }
        //setShowPrompt(false);
    }, [currentPath, history, onCancel]);

    return showPrompt ? (
        <>
            <div className={'w--100 h-100 b--shadow b--shadow-mobile active'}>
                <div className="modal">
                    <div className="modal__head">
                        <div className="type--md mb-4">{t('ROUTER_MODAL.TITLE')}</div>
                        <i onClick={() => setShowPrompt(false)} className="icon icon--close icon--base modal__close"></i>
                    </div>
                    <div className="modal__body type--color--secondary">{t('ROUTER_MODAL.DESC')}</div>
                    <div className="modal__footer">
                        <button
                            onClick={() => {
                                handleOK();
                                //onOK();
                            }}
                            type="button"
                            className="btn btn--primary btn--base mr-4"
                        >
                            {t('ROUTER_MODAL.SAVE')}
                        </button>
                        <button
                            onClick={() => {
                                handleCancel();
                                //onCancel();
                            }}
                            type="button"
                            className="btn btn--secondary btn--base"
                        >
                            {t('ROUTER_MODAL.NO')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    ) : null;
};

export default RouterPrompt;
