import {Field, Form, FormikProvider, useField, useFormik} from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { IChild } from '../../../../interfaces/IChild';
import IChildUpdate from '../../../../interfaces/IChildUpdate';
import {
  useCheckUsernameMutation,
  useGenerateChildUsernameMutation,
} from '../../../../services/authService';
import {
  ICreateChildRequest,
  IDeleteChildRequest,
  useCreateChildMutation,
  useDeleteChildMutation,
  useUpdateChildMutation,
} from '../../../../services/userService';
import MyDatePicker from '../../../components/form/MyDatePicker';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import TooltipPassword from '../../register/TooltipPassword';
import {InputAdornment, TextField} from "@mui/material";
import {t} from "i18next";
import dayjs from "dayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

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
  const [checkUsername] = useCheckUsernameMutation();
  const [generateChildUsernamePost] = useGenerateChildUsernameMutation();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [passType, setPassType] = useState("password");

  const [passTooltip, setPassTooltip] = useState<boolean>(false);

  const { t } = useTranslation();
  const myInput = document.getElementById('password') as HTMLInputElement;
  const letter = document.getElementById('letter');
  const capital = document.getElementById('capital');
  const number = document.getElementById('number');
  const length = document.getElementById('length');
  const special = document.getElementById('special');
  let initialValueObj: IChild;
  const child = useAppSelector((state) => state.parentRegister.child);

  if (childData) {
    initialValueObj = childData;
    initialValueObj['password'] = '';
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
    if(!userId) return;

    const toSend:IDeleteChildRequest = {
      parentId: userId,
      childId: childData!.id!
    };

    await deleteChild(toSend).unwrap();
    handleClose();
    toastService.success(t('FORM_VALIDATION.TOAST.DELETE'));
  };

  const handleSubmit = async (values: IChild) => {
    if(userId){
      if (childData) {
        //edit
        const toSend: ICreateChildRequest = {
          parentId: userId,
          body: {
            id: childData.id!,
            dateOfBirth: moment(values.dateOfBirth).set('hours', 12).toISOString(),
            firstName: values.firstName,
            lastName: values.lastName!,
            username: values.username,
          }
        };

        if (values.password) {
          toSend.body['password'] = values.password;
        }

        await updateChild(toSend).unwrap();
        toastService.success(t('FORM_VALIDATION.TOAST.UPDATE'));
      } else {
        //add

        const toSend: ICreateChildRequest = {
          parentId: userId,
          body: {
            dateOfBirth: moment(values.dateOfBirth).set('hours', 12).toISOString(),
            firstName: values.firstName,
            password: values.password,
            username: values.username,
          }
        };

        await createChild(toSend).unwrap();
        toastService.success(t('FORM_VALIDATION.TOAST.CREATE'));
      }
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
      username: Yup.string()
        .test('username', t('FORM_VALIDATION.USERNAME_EXIST'), async (value: any) => {
          if (value) {
            if (childData && childData.username !== value) {
              //filter all without selected child(on edit)
              const filteredArray = child.filter((x) => x.username !== value);

              //check backend usernames
              const isValid = await checkUsername({
                username: value,
              }).unwrap();

              //check local usernames
              const checkCurrent = filteredArray.find((x) => x.username === value);
              //set validation boolean
              const finalValid = isValid || checkCurrent ? true : false;

              return !finalValid;
            }else if(!childData){
              const isValid = await checkUsername({
                username: value,
              }).unwrap();

              return !isValid;
            }
            return true;
          }
          return true;
        })
        .required(t('FORM_VALIDATION.REQUIRED')),

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

  const generateChildUsername = async () => {
    const nameForGenerator = formik.values.firstName;
    if (nameForGenerator && !formik.values.username) {
      const response = await generateChildUsernamePost({
        username: nameForGenerator,
      }).unwrap();
      formik.setFieldValue('username', response.username.toLowerCase());
      formik.validateField('username');
    }
  };

  const formik = useFormik({
    initialValues: initialValueObj,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validationSchema: Yup.object().shape(generateValidationSchema()),
  });

  const visiblePassToggle = (e: any) => {
    if(passType === "password") {
      setPassType("text");
    } else {
      setPassType("password");
    }
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

      <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={() => handleClose()}></div>

      <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
        <div className="flex--primary flex--shrink">
          <div className="type--color--secondary">{(childData && t('MY_PROFILE.CHILD.EDIT_TITLE')) || t('MY_PROFILE.CHILD.ADD_TITLE')}</div>
          <div>
            <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
          </div>
        </div>
        <div className="flex--grow mt-10">
          <FormikProvider value={formik}>
            <Form>
              <div className="field align--center mb-5">
                <Field
                  as={TextField}
                  name="firstName"
                  type="text"
                  fullWidth
                  error={formik.touched.firstName && !!formik.errors.firstName}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  id="firstName"
                  label={t('MY_PROFILE.CHILD.FIRST_NAME_PLACEHOLDER')}
                  variant="outlined"
                  color="secondary"
                  InputProps={{
                    style: { fontFamily: "'Lato', sans-serif", backgroundColor:'white' },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: "'Lato', sans-serif" },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' } // Change the color of the helper text here
                  }}
                  onBlur={(e: any) => {
                    generateChildUsername();
                    formik.handleBlur(e);
                  }}
                />
              </div>
              {childData && (
                <div className="field align--center mb-5">
                  <Field
                    as={TextField}
                    name="lastName"
                    type="text"
                    fullWidth
                    error={formik.touched.lastName && !!formik.errors.lastName}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    id="lastName"
                    label={t('MY_PROFILE.CHILD.LAST_NAME_PLACEHOLDER')}
                    variant="outlined"
                    color="secondary"
                    InputProps={{
                      style: { fontFamily: "'Lato', sans-serif", backgroundColor:'white' },
                    }}
                    InputLabelProps={{
                      style: { fontFamily: "'Lato', sans-serif" },
                    }}
                    FormHelperTextProps={{
                      style: { color: 'red' } // Change the color of the helper text here
                    }}
                  />
                </div>
              )}
              <div className="field align--center mb-5">
                <Field
                  as={TextField}
                  name="username"
                  type="text"
                  fullWidth
                  error={formik.touched.lastName && !!formik.errors.lastName}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  id="username"
                  label={t('MY_PROFILE.CHILD.USERNAME_PLACEHOLDER')}
                  variant="outlined"
                  color="secondary"
                  InputProps={{
                    style: { fontFamily: "'Lato', sans-serif", backgroundColor:'white' },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: "'Lato', sans-serif" },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' } // Change the color of the helper text here
                  }}
                />

              </div>
              <div className="field">
                <DatePicker label={t('REGISTER.FORM.CHILD_DATE_OF_BIRTH')}
                            defaultValue={dayjs()}
                            value={dayjs(formik.values.dateOfBirth)}
                            format="DD/MM/YYYY"
                            onChange={(newValue) =>
                              formik.setFieldValue(formik.getFieldProps('dateOfBirth').name, newValue?.toString())}
                />
                <label className="field__label" htmlFor="dateOfBirth" style={{fontFamily: "'Lato', sans-serif"}}>
                  {t('REGISTER.FORM.CHILD_DATE_OF_BIRTH')}
                </label>
                <MyDatePicker form={formik} field={formik.getFieldProps('dateOfBirth')} meta={formik.getFieldMeta('dateOfBirth')} />
              </div>
              <div className="field">

                <Field
                  as={TextField}
                  name="password"
                  type={passType}
                  fullWidth
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                  id="password"
                  label={childData ? t('MY_PROFILE.CHILD.PASSWORD_OPTIONAL'):  t('MY_PROFILE.CHILD.PASSWORD')}
                  variant="outlined"
                  color="secondary"
                  InputProps={{
                    style: { fontFamily: "'Lato', sans-serif", backgroundColor:'white' },
                    endAdornment: (
                      <InputAdornment position="start">
                        <i className="icon icon--sm icon--visible input--text--password" onClick={(e: any) => visiblePassToggle(e)}></i>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { fontFamily: "'Lato', sans-serif" },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' } // Change the color of the helper text here
                  }}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onBlur={(e: any) => {
                    handlePasswordBlur();
                    formik.handleBlur(e);
                  }}
                  onFocus={handlePasswordFocus}
                  onKeyUp={handleKeyUp}
                />
                {childData && <p className="mb-2 type--color--tertiary">{t('MY_PROFILE.CHILD.PASSWORD_OPTIONAL')}</p>}

                <TooltipPassword passTooltip={passTooltip} />
              </div>
            </Form>
          </FormikProvider>
        </div>
        <div className="flex--shirnk sidebar--secondary__bottom mt-10">
          <div className="flex--primary mt-6">
            <button className="btn btn--clear type--wgt--extra-bold" onClick={() => formik.handleSubmit()}>
              {(childData && t('ADD_CHILD.SAVE')) || t('ADD_CHILD.TITLE')}
            </button>
            {(childData && (
              <button onClick={() => handleDelete()} className="btn btn--clear type--color--error type--wgt--extra-bold">
                {t('MY_PROFILE.CHILD.DELETE')}
              </button>
            )) || (
              <button onClick={() => handleClose()} className="btn btn--clear type--color--error type--wgt--extra-bold">
                {t('MY_PROFILE.CHILD.CANCEL')}
              </button>
            )}
          </div>
        </div>
      </div>
      </LocalizationProvider>
    </div>
  );
};

export default AddChildSidebar;
