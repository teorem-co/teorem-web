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
                    <div className="type--wgt--semibold">Warning</div>
                    <div className="">You have unsaved changes</div>
                    <div className="">
                        <button
                            onClick={() => {
                                handleCancel();
                                //onCancel();
                            }}
                            type="button"
                            className="btn btn--primary"
                        >
                            No
                        </button>
                        <button
                            onClick={() => {
                                handleOK();
                                //onOK();
                            }}
                            type="button"
                            className="btn btn--primary"
                        >
                            Save
                        </button>
                    </div>
                    <i
                        onClick={() => setShowPrompt(false)}
                        className="icon icon--close icon--base"
                    ></i>
                </div>
            </div>
        </>
    ) : null;
};

export default RouterPrompt;
