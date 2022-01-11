import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select, { components } from 'react-select';
import * as Yup from 'yup';

import gradientCircle from '../../../../assets/images/gradient-circle.svg';
import IRoleSelectionOption from '../../../../interfaces/IRoleSelectionOption';
import { ChildOptions } from '../../../../slices/childSlice';
import { RoleOptions, setSelectedRole } from '../../../../slices/roleSlice';
import { roleSelectionOptions } from '../../../constants/roleSelectionOptions';
import { useAppDispatch } from '../../../hooks';
import { PATHS } from '../../../routes';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const StepTwoParent: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
    step,
}) => {
    const [value, onChange] = useState(new Date());
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const options = [
        {
            value: 1,
            label: 'Poland',
        },
    ];

    const phoneOptions = [
        {
            value: 1,
            label: '+385',
        },
        {
            value: 2,
            label: '+98',
        },
        {
            value: 3,
            label: '+355',
        },
        {
            value: 4,
            label: '+54',
        },
    ];

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: '',
    };

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    const handleRoleSelection = () => {
        const options: { [key: number]: ChildOptions } = {
            0: ChildOptions.Child1,
        };
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });
    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    <div className="role-selection__form">
                        {roleSelectionOptions.map((x) => {
                            return (
                                <div
                                    className="role-selection__item"
                                    key={x.id}
                                >
                                    <img
                                        src={gradientCircle}
                                        alt="gradient circle"
                                    />
                                    <div className="flex--grow ml-4">
                                        <div className="mb-1">
                                            {t(
                                                x.id === 0
                                                    ? 'ROLE_SELECTION.STUDENT_TITLE'
                                                    : x.id === 1
                                                    ? 'ROLE_SELECTION.PARENT_TITLE'
                                                    : 'ROLE_SELECTION.TUTOR_TITLE'
                                            )}
                                        </div>
                                        <div className="type--color--secondary">
                                            {t(
                                                x.id === 0
                                                    ? 'ROLE_SELECTION.STUDENT_DESCRIPTION'
                                                    : x.id === 1
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
                </Form>
            </FormikProvider>
        </>
    );
};

export default StepTwoParent;
