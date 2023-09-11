import { t } from 'i18next';
import { FC } from 'react';

interface Props {
    passTooltip: boolean;
    positionTop?: boolean;
    className?:string;
}

const PasswordTooltip: FC<Props> = (props: Props) => {
    const { passTooltip, positionTop, className } = props;

    return (
        <>
          <table className={`text-align--start password-tooltip ${className}`}>
            <tbody>
            <tr>
              <td className="mb-3" colSpan={2}>
                {t('FORM_VALIDATION.PASSWORD_MUST')}:
              </td>
            </tr>
            <tr>
              <td>
                <i
                  id="length"
                  className="icon icon--base icon--close icon--grey mr-3"
                ></i>
              </td>
              <td>{t('FORM_VALIDATION.MIN_CHARACTERS')}</td>
            </tr>
            <tr>
              <td>
                <i
                  id="letter"
                  className="icon icon--base icon--close icon--grey mr-3"
                ></i>
              </td>
              <td>{t('FORM_VALIDATION.LOWERCASE')}</td>
            </tr>
            <tr>
              <td>
                <i
                  id="capital"
                  className="icon icon--base icon--close icon--grey mr-3"
                ></i>
              </td>
              <td>{t('FORM_VALIDATION.UPPERCASE')}</td>
            </tr>
            <tr>
              <td>
                <i
                  id="number"
                  className="icon icon--base icon--close icon--grey mr-3"
                ></i>
              </td>
              <td>{t('FORM_VALIDATION.NUMBER')}</td>
            </tr>
            <tr>
              <td>
                <i
                  id="special"
                  className="icon icon--base icon--close icon--grey mr-3"
                ></i>
              </td>
              <td>{t('FORM_VALIDATION.SPECIAL_CHAR')}</td>
            </tr>
            </tbody>
          </table>
        </>
    );
};

export default PasswordTooltip;
