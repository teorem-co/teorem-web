import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { resetParentRegister } from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../../slices/tutorRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MySelect, {
    OptionType,
    PhoneOptionType,
} from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { phoneNumberInput } from '../../../constants/phoneNumberInput';
import { phoneNumberOption } from '../../../constants/phoneNumberOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useRegisterStudentMutation } from '../../../services/authService';
import toastService from '../../../services/toastService';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
    countryId: string;
    prefix: string;
    phoneNumber: string;
    dateOfBirth: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const StudentOnboarding: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
}) => {
    const [registerStudent, { isSuccess }] = useRegisterStudentMutation();
    const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<OptionType[]>([]);
    const state = useAppSelector((state) => state.studentRegister);
    const roleAbrv = useAppSelector((state) => state.role.selectedRole);
    const { firstName, lastName, password, passwordRepeat, email } = state;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [getCountries, { data: countries }] = useLazyGetCountriesQuery();

    useEffect(() => {
        getCountries();
    }, []);

    useEffect(() => {
        const currentCountries: OptionType[] = countries
            ? countries.map((x: ICountry) => {
                  return {
                      label: x.name,
                      value: x.id,
                  };
              })
            : [];
        setCountryOptions(currentCountries);
        const currentPhone: PhoneOptionType[] = countries
            ? countries.map((x: ICountry) => {
                  return {
                      label: x.name,
                      prefix: x.phonePrefix,
                      value: x.phonePrefix,
                  };
              })
            : [];
        setPhoneOptions(currentPhone);
    }, [countries]);

    const initialValuesOne: StepOneValues = {
        countryId: '',
        prefix: '',
        phoneNumber: '',
        dateOfBirth: '',
    };

    const formik = useFormik({
        initialValues: initialValuesOne,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            prefix: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: StepOneValues) => {
        registerStudent({
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: passwordRepeat,
            roleAbrv: roleAbrv ? roleAbrv : '',
            countryId: values.countryId,
            phonePrefix: values.prefix,
            phoneNumber: values.phoneNumber,
            dateOfBirth: moment(values.dateOfBirth).toISOString(),
            email: email,
        });
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetTutorRegister());
            dispatch(resetParentRegister());
            dispatch(resetStudentRegister());
            handleNextStep();
            toastService.success('You are registered successfully.');
        }
    });

    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    {/* <div>{JSON.stringify(formik.values, null, 2)}</div> */}
                    <div className="field">
                        <label htmlFor="countryId" className="field__label">
                            {t('REGISTER.FORM.COUNTRY')}
                        </label>

                        <MySelect
                            form={formik}
                            field={formik.getFieldProps('countryId')}
                            meta={formik.getFieldMeta('countryId')}
                            isMulti={false}
                            classNamePrefix="onboarding-select"
                            options={countryOptions}
                            placeholder="Choose your country"
                            customInputField={countryInput}
                            customOption={countryOption}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            {t('REGISTER.FORM.PHONE_NUMBER')}
                        </label>
                        <div className="flex flex--center pos--rel">
                            <MySelect
                                form={formik}
                                field={formik.getFieldProps('prefix')}
                                meta={formik.getFieldMeta('prefix')}
                                isMulti={false}
                                options={phoneOptions}
                                classNamePrefix="onboarding-select"
                                className="w--120"
                                placeholder="+00"
                                customInputField={phoneNumberInput}
                                customOption={phoneNumberOption}
                                isSearchable={false}
                                withoutErr={
                                    formik.errors.prefix &&
                                    formik.touched.prefix
                                        ? true
                                        : false
                                }
                            />
                            <div className="ml-4"></div>
                            <TextField
                                wrapperClassName="flex--grow"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className="input input--base"
                                withoutErr={
                                    formik.errors.phoneNumber &&
                                    formik.touched.phoneNumber
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div className="flex flex--center">
                            {formik.errors.prefix && formik.touched.prefix ? (
                                <div className="field__validation mr-4">
                                    {formik.errors.prefix
                                        ? formik.errors.prefix
                                        : ''}
                                </div>
                            ) : (
                                <></>
                            )}
                            {formik.errors.phoneNumber &&
                            formik.touched.phoneNumber ? (
                                <div className="field__validation">
                                    {formik.errors.phoneNumber
                                        ? formik.errors.phoneNumber
                                        : ''}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            {t('REGISTER.FORM.DATE_OF_BIRTH')}
                        </label>
                        <MyDatePicker
                            form={formik}
                            field={formik.getFieldProps('dateOfBirth')}
                            meta={formik.getFieldMeta('dateOfBirth')}
                        />
                    </div>
                    <div
                        className="btn btn--base btn--primary type--center w--100 mb-2 mt-6"
                        onClick={() => formik.handleSubmit()}
                    >
                        {t('REGISTER.FINISH')}
                    </div>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {t('REGISTER.BACK_TO_REGISTER')}
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
};

export default StudentOnboarding;
