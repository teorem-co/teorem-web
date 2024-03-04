import * as React from 'react';

import toastService from '../../../services/toastService';
import { useDisconnectStripeMutation } from '../../../../services/userService';

export function DisconnectStripe({ tutorId, setRefetch }: { tutorId: string; setRefetch: React.Dispatch<React.SetStateAction<number>> }) {
    const [opened, setOpened] = React.useState(false);
    const [disconnectStripe] = useDisconnectStripeMutation();
    return (
        <>
            {opened && (
                <div className="modal__overlay">
                    <div className="modal">
                        <div className="modal__head">
                            <div className="type--md type--wgt--bold">Disconnect Stripe</div>
                            <i
                                onClick={() => {
                                    setOpened(false);
                                }}
                                className="modal__close icon icon--base icon--close icon--grey"
                            ></i>
                        </div>
                        <div className="modal__separator"></div>
                        <div className="modal__body">
                            <div>Are you sure?</div>
                            <div>This action is not reversible.</div>
                            <div className="flex">
                                <button
                                    onClick={() => {
                                        setOpened(false);
                                    }}
                                    className="btn btn--base btn--clear w--100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn--base btn--error w--100"
                                    onClick={() =>
                                        disconnectStripe(tutorId).then((res: any) => {
                                            if (!res?.error) {
                                                toastService.success('Stripe disconnected successfully');
                                                setRefetch((prevState: number) => prevState + 1);
                                                setOpened(false);
                                            }
                                        })
                                    }
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button className="btn btn--base btn--error w--100 type--center flex flex--center flex--jc--center mt-2" onClick={() => setOpened(true)}>
                <span>Disconnect Stripe</span>
            </button>
        </>
    );
}
