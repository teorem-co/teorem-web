import { Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useLazyGetProfileProgressQuery } from '../../../../services/tutorService';
import { useChangePasswordMutation } from '../../../../services/userService';
import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import TooltipPassword from '../../register/TooltipPassword';
import AddCreditCard from '../components/AddCreditCard';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IChangePassword from '../interfaces/IChangePassword';
import { setMyProfileProgress } from '../slices/myProfileSlice';

interface Values {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfileAccount = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [changePassword] = useChangePasswordMutation();

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    //const [editSidebarOpen, setEditSidebarOpen] = useState(false);
    const [saveBtnActive, setSaveBtnActive] = useState(false);
    const [passTooltip, setPassTooltip] = useState<boolean>(false);

    const { t } = useTranslation();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const dispatch = useAppDispatch();
    const initialValues: Values = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const myInput = document.getElementById('newPassword') as HTMLInputElement;
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');
    const special = document.getElementById('special');

    const handleChangeForSave = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    const handlePasswordFocus = () => {
        setPassTooltip(true);
    };

    const handlePasswordBlur = () => {
        setPassTooltip(false);
    };

    const handleKeyUp = () => {
        const lowerCaseLetters = /[a-z]/g;
        if (letter && myInput?.value.match(lowerCaseLetters)) {
            letter.classList.remove('icon--grey');
            letter.classList.add('icon--success');
        } else {
            letter?.classList.remove('icon--success');
            letter?.classList.add('icon--grey');
        }

        // Validate capital letters
        const upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital?.classList.remove('icon--grey');
            capital?.classList.add('icon--success');
        } else {
            capital?.classList.remove('icon--success');
            capital?.classList.add('icon--grey');
        }

        // Validate numbers
        const numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number?.classList.remove('icon--grey');
            number?.classList.add('icon--success');
        } else {
            number?.classList.remove('icon--success');
            number?.classList.add('icon--grey');
        }

        // Validate length
        if (myInput.value.length >= 8) {
            length?.classList.remove('icon--grey');
            length?.classList.add('icon--success');
        } else {
            length?.classList.remove('icon--success');
            length?.classList.add('icon--grey');
        }

        // Validate special characters
        const specialCharacters = /[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]/;
        if (myInput.value.match(specialCharacters)) {
            special?.classList.remove('icon--grey');
            special?.classList.add('icon--success');
        } else {
            special?.classList.remove('icon--success');
            special?.classList.add('icon--grey');
        }
    };

    const closeAddCardSidebar = () => {
        setAddSidebarOpen(false);
    };

    // const closeEditCardSidebar = () => {
    //     setEditSidebarOpen(false);
    // };

    const handleSubmit = async (values: Values) => {
        const toSend: IChangePassword = {
            oldPassword: values.currentPassword,
            password: values.newPassword,
            confirmPassword: values.confirmPassword,
        };
        await changePassword(toSend);
        toastService.success('You successfully changed a password');
        formik.resetForm();
        setSaveBtnActive(false);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            currentPassword: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            newPassword: Yup.string()
                .min(8, t('FORM_VALIDATION.TOO_SHORT'))
                .max(128, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], t('FORM_VALIDATION.PASSWORD_MATCH'))
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const fetchProgress = async () => {
        //If there is no state in redux for profileProgress fetch data and save result to redux
        if (profileProgressState.percentage === 0) {
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    useEffect(() => {
        handleChangeForSave();
    }, [formik.values]);

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    aditionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                />

                {/* PERSONAL INFO */}
                <FormikProvider value={formik}>
                    <Form>
                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">{t('ACCOUNT.CHANGE_PASSWORD.TITLE')}</div>
                                <div className="type--color--tertiary w--200--max">{t('ACCOUNT.CHANGE_PASSWORD.DESCRIPTION')}</div>
                                {saveBtnActive ? (
                                    <button className="btn btn--primary btn--lg mt-6" type="submit">
                                        {t('ACCOUNT.SUBMIT')}
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="w--800--max">
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label htmlFor="currentPassword" className="field__label">
                                                {t('ACCOUNT.CHANGE_PASSWORD.CURRENT_PASSWORD')}
                                            </label>
                                            <TextField
                                                name="currentPassword"
                                                id="currentPassword"
                                                placeholder="Enter Current Password"
                                                password={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label htmlFor="newPassword" className="field__label">
                                                {t('ACCOUNT.CHANGE_PASSWORD.NEW_PASSWORD')}
                                            </label>
                                            <TextField
                                                name="newPassword"
                                                id="newPassword"
                                                placeholder="Enter New Password"
                                                password={true}
                                                onFocus={handlePasswordFocus}
                                                onBlur={(e: any) => {
                                                    handlePasswordBlur();
                                                    formik.handleBlur(e);
                                                }}
                                                onKeyUp={handleKeyUp}
                                            />
                                            <TooltipPassword positionTop={true} passTooltip={passTooltip} />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label htmlFor="confirmPassword" className="field__label">
                                                {t('ACCOUNT.CHANGE_PASSWORD.CONFIRM_PASSWORD')}
                                            </label>
                                            <TextField name="confirmPassword" id="confirmPassword" placeholder="Enter New Password" password={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">{t('ACCOUNT.CARD_DETAILS.TITLE')}</div>
                                <div className="type--color--tertiary w--200--max">{t('ACCOUNT.CARD_DETAILS.DESCRIPTION')}</div>
                            </div>
                            {/* <div className="dash-wrapper">
                                <div className="dash-wrapper__item">
                                    <div className="dash-wrapper__item__element" onClick={() => setAddSidebarOpen(true)}>
                                        <div className="flex--primary cur--pointer">
                                            <div>
                                                <div className="type--wgt--bold">{t('ACCOUNT.CARD_DETAILS.ADD_NEW')}</div>
                                                <div>{t('ACCOUNT.CARD_DETAILS.ADD_NEW_DESC')}</div>
                                            </div>
                                            <div>
                                                <i className="icon icon--base icon--plus icon--primary"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div> */}
                            <div>
                                <div className="btn btn--primary btn--base">Go to stripe</div>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <AddCreditCard closeSidebar={closeAddCardSidebar} sideBarIsOpen={addSidebarOpen} />
        </MainWrapper>
    );
};

export default ProfileAccount;
