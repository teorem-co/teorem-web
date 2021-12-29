import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../app/hooks';
import logo from './../../../assets/images/logo.png';
import gradientCircle from './../../../assets/images/gradient-circle.svg';
import { roleSelectionOptions } from '../../../app/constants/roleSelectionOptions';
import IRoleSelectionOption from '../../../interfaces/IRoleSelectionOption';
import heroImg from '../../../assets/images/hero-img.png';
import { setSelectedRole, RoleOptions } from '../../../slices/roleSlice';
import { PATHS } from '../../../app/routes';

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

    return (
        <>
            <div className="role-selection">
                <div className="role-selection__aside">
                    <img src={heroImg} alt="Hero Img" />
                </div>
                <div className="role-selection__content">
                    <div className="flex--grow">
                        <div className="mb-22">
                            <img src={logo} alt="Theorem" />
                        </div>
                        <div className="type--lg type--wgt--bold mb-4">
                            {t('ROLE_SELECTION.TITLE')}
                        </div>
                        <div className="mb-2">{t('ROLE_SELECTION.ACTION')}</div>
                        <div className="role-selection__form">
                            {roleSelectionOptions.map(
                                (roleOption: IRoleSelectionOption) => {
                                    return (
                                        <div
                                            className="role-selection__item"
                                            key={roleOption.id}
                                            onClick={() =>
                                                handleRoleSelection(
                                                    roleOption.id
                                                )
                                            }
                                        >
                                            <img
                                                src={gradientCircle}
                                                alt="gradient circle"
                                            />
                                            <div className="flex--grow ml-4">
                                                <div className="mb-1">
                                                    {roleOption.title}
                                                </div>
                                                <div className="type--color--secondary">
                                                    {roleOption.description}
                                                </div>
                                            </div>
                                            <i className="icon icon--base icon--arrow-right icon--primary"></i>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                    <div className="flex--primary w--448--max">
                        <div>{t('WATERMARK')}</div>
                        <div>
                            {t('ROLE_SELECTION.ACCOUNT')}{' '}
                            <a href="/login">{t('ROLE_SELECTION.LOG_IN')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoleSelection;
