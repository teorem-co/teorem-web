import { Form, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { IChild } from '../../../../interfaces/IChild';
import IChildUpdate from '../../../../interfaces/IChildUpdate';
import { useCreateChildMutation, useDeleteChildMutation, useUpdateChildMutation } from '../../../../services/userService';
import MyDatePicker from '../../../components/form/MyDatePicker';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import TooltipPassword from '../../register/TooltipPassword';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    childData: IChild | null;
}

const AddChildSidebar = (props: Props) => {
    const { sideBarIsOpen, childData, closeSidebar } = props;

    const [updateChild] = useUpdateChildMutation();
    const [createChild] = useCreateChildMutation();
    const [deleteChild] = useDeleteChildMutation();

    const [passTooltip, setPassTooltip] = useState<boolean>(false);

    const { t } = useTranslation();
    const myInput = document.getElementById('password') as HTMLInputElement;
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');
    const special = document.getElementById('special');
    let initialValueObj: IChild;

    if (childData) {
        initialValueObj = childData;
    } else {
        initialValueObj = {
            firstName: '',
            username: '',
            dateOfBirth: '',
            password: '',
        };
    }

    const handleClose = () => {
        formik.resetForm();
        closeSidebar();
    };

    const handleDelete = async () => {
        await deleteChild(childData!.id!).unwrap();
        handleClose();
        toastService.success('You successfully deleted a child');
    };

    const handleSubmit = async (values: IChild) => {
        if (childData) {
            //edit
            const toSend: IChildUpdate = {
                childId: childData.id!,
                dateOfBirth: values.dateOfBirth,
                firstName: values.firstName,
                lastName: values.lastName!,
                username: values.username,
            };
            if (values.password) {
                toSend['password'] = values.password;
            }

            await updateChild(toSend).unwrap();
            toastService.success('You successfully updated the child');
        } else {
            //add
            const toSend: IChild = {
                dateOfBirth: values.dateOfBirth,
                firstName: values.firstName,
                password: values.password,
                username: values.username,
            };
            await createChild(toSend).unwrap();
            toastService.success('You successfully created a child');
        }
        handleClose();
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

    const handlePasswordBlur = () => {
        setPassTooltip(false);
    };

    const handlePasswordFocus = () => {
        setPassTooltip(true);
    };

    const generateValidationSchema = () => {
        const validationSchema: any = {
            firstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            username: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        };

        if (childData) {
            //edit
            validationSchema['lastName'] = Yup.string().required(t('FORM_VALIDATION.REQUIRED'));
            return validationSchema;
        }

        //add
        validationSchema['password'] = Yup.string()
            .min(8, t('FORM_VALIDATION.TOO_SHORT'))
            .max(128, t('FORM_VALIDATION.TOO_LONG'))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                t('FORM_VALIDATION.PASSWORD_STRENGTH')
            )
            .required(t('FORM_VALIDATION.REQUIRED'));

        return validationSchema;
    };

    const formik = useFormik({
        initialValues: initialValueObj,
        onSubmit: handleSubmit,
        enableReinitialize: true,
        validationSchema: Yup.object().shape(generateValidationSchema()),
    });

    return (
        <div>
            <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={() => handleClose()}></div>

            <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{(childData && 'EDIT A CHILD') || 'ADD NEW CHILD'}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form>
                            <div className="field">
                                <label htmlFor="firstName" className="field__label">
                                    First Name*
                                </label>
                                <TextField name="firstName" id="firstName" placeholder="Enter Child Name" />
                            </div>
                            {childData && (
                                <div className="field">
                                    <label htmlFor="lastName" className="field__label">
                                        LastName*
                                    </label>
                                    <TextField name="lastName" id="lastName" placeholder="Enter Username" />
                                </div>
                            )}
                            <div className="field">
                                <label htmlFor="username" className="field__label">
                                    Username*
                                </label>
                                <TextField name="username" id="username" placeholder="Enter Username" />
                            </div>
                            <div className="field">
                                <label className="field__label" htmlFor="dateOfBirth">
                                    {t('REGISTER.FORM.CHILD_DATE_OF_BIRTH')}
                                </label>
                                <MyDatePicker form={formik} field={formik.getFieldProps('dateOfBirth')} meta={formik.getFieldMeta('dateOfBirth')} />
                            </div>
                            <div className="field">
                                <label className="field__label" htmlFor="password">
                                    Enter a new password
                                </label>
                                {childData && (
                                    <p className="mb-2 type--color--tertiary">
                                        This field is optional, if you want to change current child's password you can do it in field below.
                                    </p>
                                )}

                                <TextField
                                    name="password"
                                    id="password"
                                    placeholder="Type your password"
                                    className="input input--base input--text input--icon"
                                    password={true}
                                    onBlur={(e: any) => {
                                        handlePasswordBlur();
                                        formik.handleBlur(e);
                                    }}
                                    onFocus={handlePasswordFocus}
                                    onKeyUp={handleKeyUp}
                                />

                                <TooltipPassword passTooltip={passTooltip} />
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--clear type--wgt--extra-bold" onClick={() => formik.handleSubmit()}>
                            {(childData && 'Edit Child') || 'Add New Child'}
                        </button>
                        {(childData && (
                            <button onClick={() => handleDelete()} className="btn btn--clear type--color--error type--wgt--extra-bold">
                                Delete
                            </button>
                        )) || (
                            <button onClick={() => handleClose()} className="btn btn--clear type--color--error type--wgt--extra-bold">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddChildSidebar;
