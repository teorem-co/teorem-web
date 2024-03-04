import { t } from 'i18next';
import { FC } from 'react';

interface Props {
    passTooltip: boolean;
    positionTop?: boolean;
}

const TooltipPassword: FC<Props> = (props: Props) => {
    const { passTooltip, positionTop } = props;

    return (
        <>
            <div className={`tooltip--password ${passTooltip ? 'active' : ''} ${positionTop ? 'tooltip--password--pos-top' : ''}`}>
                <div className="mb-3">{t('FORM_VALIDATION.PASSWORD_MUST')}</div>
                <div>
                    <div>
                        <i id="length" className="icon icon--base icon--check icon--grey mr-3"></i>
                        <span>{t('FORM_VALIDATION.MIN_CHARACTERS')}</span>
                    </div>
                    <div>
                        <i id="letter" className="icon icon--base icon--check icon--grey mr-3"></i>
                        <span>{t('FORM_VALIDATION.LOWERCASE')}</span>
                    </div>
                    <div>
                        <i id="capital" className="icon icon--base icon--check icon--grey mr-3"></i>
                        <span>{t('FORM_VALIDATION.UPPERCASE')}</span>
                    </div>
                    <div>
                        <i id="number" className="icon icon--base icon--check icon--grey mr-3"></i>
                        <span>{t('FORM_VALIDATION.NUMBER')}</span>
                    </div>
                    <div>
                        <i id="special" className="icon icon--base icon--check icon--grey mr-3"></i>
                        <span>{t('FORM_VALIDATION.SPECIAL_CHAR')}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TooltipPassword;
