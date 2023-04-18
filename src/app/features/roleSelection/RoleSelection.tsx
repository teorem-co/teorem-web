import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import heroImg from '../../../assets/images/hero-img.png';
import IRoleSelectionOption from '../../../interfaces/IRoleSelectionOption';
import { resetParentRegister } from '../../../slices/parentRegisterSlice';
import { RoleOptions, setSelectedRole } from '../../../slices/roleSlice';
import { resetStudentRegister } from '../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../slices/tutorRegisterSlice';
import ImageCircle from '../../components/ImageCircle';
import { roleSelectionOptions } from '../../constants/roleSelectionOptions';
import { useAppDispatch } from '../../hooks';
import { PATHS } from '../../routes';
import logo from './../../../assets/images/logo.svg';

const RoleSelection: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleRoleSelection = (roleId: number) => {
    const options: { [key: number]: RoleOptions } = {
      0: RoleOptions.Student,
      1: RoleOptions.Parent,
      2: RoleOptions.Tutor,
    };
    options[roleId] && dispatch(setSelectedRole(options[roleId]));
    options[roleId] && history.push(PATHS.REGISTER);
  };

  const handleResetForm = () => {
    dispatch(resetParentRegister());
    dispatch(resetStudentRegister());
    dispatch(resetTutorRegister());
  };

  return (
    <>
      <div className="role-selection">
        {/*<div className="role-selection__aside">*/}
        {/*    /!* <img src={heroImg} alt="Hero Img" />*!/*/}
        {/*    <div className="teorem-area">*/}
        {/*        <ul className="teorem-circles">*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*            <li></li>*/}
        {/*        </ul>*/}
        {/*    </div >*/}
        {/*</div>*/}
        <div className="role-selection__content">
          <div className="flex--grow w--448--max">
            <div className="mb-22">
              <img className="w--128" src={logo} alt="Teorem" />
            </div>
            <div className="type--lg type--wgt--bold mb-4">{t('ROLE_SELECTION.TITLE')}</div>
            <div className="mb-2">{t('ROLE_SELECTION.ACTION')}</div>
            <div className="role-selection__form">
              {roleSelectionOptions.map((roleOption: IRoleSelectionOption) => {
                const { id } = roleOption;
                return (
                  <div className="role-selection__item" key={id} onClick={() => handleRoleSelection(id)}>
                    <ImageCircle initials={`${roleOption.title.charAt(0)}`} />
                    <div className="flex--grow ml-4">
                      <div className="mb-1">
                        {t(id === 0 ? 'ROLE_SELECTION.STUDENT_TITLE' : id === 1 ? 'ROLE_SELECTION.PARENT_TITLE' : 'ROLE_SELECTION.TUTOR_TITLE')}
                      </div>
                      <div className="type--color--secondary">
                        {t(
                          id === 0
                            ? 'ROLE_SELECTION.STUDENT_DESCRIPTION'
                            : id === 1
                            ? 'ROLE_SELECTION.PARENT_DESCRIPTION'
                            : 'ROLE_SELECTION.TUTOR_DESCRIPTION'
                        )}
                      </div>
                    </div>
                    <i className="icon icon--base icon--chevron-right icon--primary"></i>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex--primary w--448--max">
            <div className="type--color--tertiary">{t('WATERMARK')}</div>
            <div>
              {t('ROLE_SELECTION.ACCOUNT')}&nbsp;
              <Link className="type--wgt--extra-bold" to={PATHS.LOGIN} onClick={() => handleResetForm()}>
                {t('ROLE_SELECTION.LOG_IN')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;
