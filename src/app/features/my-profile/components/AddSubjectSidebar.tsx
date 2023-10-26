import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
  useGetLevelsQuery,
} from '../../../../services/levelService';

import {
  useCreateSubjectMutation, useGetSubjectsQuery,
} from '../../../../services/subjectService';
import {
  useLazyGetProfileProgressQuery} from '../../../../services/tutorService';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import {
  useLazyGetCountriesQuery,
} from '../../../features/onboarding/services/countryService';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import { setMyProfileProgress } from '../slices/myProfileSlice';

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
    handleGetData: () => void;
    tutorId?: string;
}

interface Values {
    level: string;
    subject: string;
    price: string;
}

const AddSubjectSidebar = (props: Props) => {
    const { closeSidebar, sideBarIsOpen, handleGetData } = props;

    const { data: subjectOptions, isLoading: isLoadingSubjects } = useGetSubjectsQuery();
    const { data: levelOptions, isLoading: isLoadingLevels } = useGetLevelsQuery();

    const [createSubject, {isSuccess}] = useCreateSubjectMutation();


    const [getProfileProgress] = useLazyGetProfileProgressQuery();

    const levelDisabled = !levelOptions || isLoadingLevels;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const initialValues: Values = {
        level: '',
        subject: '',
        price: '',
    };

    const [currency, setCurrency] = useState('PZL');
    const [minPrice, setMinPrice] = useState(47);
    const countryId = useAppSelector((state) => state?.user?.user?.countryId);
    const [getCountries] = useLazyGetCountriesQuery();
    const getCurrency = async () => {
        const res = await getCountries().unwrap();
        res.forEach(c => {
            if (c.id === countryId) {
                setCurrency(c.currencyCode);
                if (c.currencyCode == "EUR")
                    setMinPrice(10);
                if (c.currencyCode == "PLZ")
                    setMinPrice(47);
            }
        });
    };

    const handleSubmit = async (values: Values) => {
        await createSubject({
          subjectId: values.subject,
          price: Number(values.price),
          tutorId: props.tutorId || getUserId(),
          levelId: values.level
        });

        handleGetData();
        closeSidebar();
        formik.resetForm();

      //handle profile progress
      if (!profileProgressState.myTeachings) {
        const progressResponse = await getProfileProgress().unwrap();
        dispatch(setMyProfileProgress(progressResponse));
      }
    };

    useEffect(() => {
      if(isSuccess){
        toastService.success(t('MY_PROFILE.MY_TEACHINGS.CREATED'));
      }
    }, [isSuccess]);

    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange:true,
        validateOnBlur:true,
        onSubmit: handleSubmit,
        validationSchema: Yup.object().shape({
            level: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            subject: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            price: Yup.number().required(t('FORM_VALIDATION.REQUIRED')).min(minPrice, t('FORM_VALIDATION.PRICE') + minPrice),
        }),
    });

    useEffect(() => {
        getCurrency();
    }, []);

  return (
        <div>
            <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>

            <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
                <div className="flex--primary flex--shrink">
                    <div className="type--color--secondary">{t('MY_PROFILE.MY_TEACHINGS.ADD_TITLE')}</div>
                    <div>
                        <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
                    </div>
                </div>
                <div className="flex--grow mt-10">
                    <FormikProvider value={formik}>
                        <Form noValidate>
                            <div>
                                <label htmlFor="subject">{t('MY_PROFILE.MY_TEACHINGS.LEVEL')}*</label>
                                <MySelect
                                    field={formik.getFieldProps('level')}
                                    form={formik}
                                    meta={formik.getFieldMeta('level')}
                                    isMulti={false}
                                    options={levelOptions ? levelOptions : []}
                                    isDisabled={levelDisabled}
                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.LEVEL')}
                                    classNamePrefix="onboarding-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="level">{t('MY_PROFILE.MY_TEACHINGS.SUBJECT')}*</label>
                                <MySelect
                                    key={formik.values.subject}
                                    field={formik.getFieldProps('subject')}
                                    form={formik}
                                    meta={formik.getFieldMeta('subject')}
                                    isMulti={false}
                                    options={subjectOptions}
                                    isDisabled={levelDisabled || isLoadingSubjects}
                                    noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                                    classNamePrefix="onboarding-select"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="price" className="field__label">
                                    {t('MY_PROFILE.MY_TEACHINGS.PRICING')} ({currency})*
                                </label>
                                <TextField
                                    name="price"
                                    id="price"
                                    placeholder={
                                        t('MY_PROFILE.MY_TEACHINGS.PRICING_PLACEHOLDER') +
                                        minPrice + ' ' + currency + '/h'}
                                    withoutErr={
                                        !(formik.errors.price &&
                                            formik.touched.price)}
                                    type="number"
                                />
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex--shirnk sidebar--secondary__bottom mt-10">
                    <div className="flex--primary mt-6">
                        <button className="btn btn--primary btn--base type--wgt--extra-bold" onClick={() => formik.handleSubmit()}>
                            {t('MY_PROFILE.MY_TEACHINGS.SAVE')}
                        </button>
                        <button className="btn btn--clear type--color--error type--wgt--extra-bold" onClick={closeSidebar}>
                            {t('MY_PROFILE.MY_TEACHINGS.CANCEL')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSubjectSidebar;
