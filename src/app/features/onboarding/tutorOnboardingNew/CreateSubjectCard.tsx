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
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';

interface Props {
  // sideBarIsOpen: boolean;
  // closeSidebar: () => void;
  handleGetData: () => void;
  tutorId?: string;
}

interface Values {
  level: string;
  subject: string;
  price: string;
}
export const CreateSubjectCard = (props: Props) => {
      const { handleGetData } = props;

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
      <div className="card--primary field__w-fit-content">
            <FormikProvider value={formik}>
              <Form noValidate>
                <div
                  style={{gap: '10px'}}
                  className="flex flex--row field__w-fit-content">
                  <div>
                    <MySelect
                      field={formik.getFieldProps('level')}
                      form={formik}
                      meta={formik.getFieldMeta('level')}
                      isMulti={false}
                      options={levelOptions ? levelOptions : []}
                      isDisabled={levelDisabled}
                      placeholder={t('SEARCH_TUTORS.PLACEHOLDER.LEVEL')}
                      classNamePrefix="onboarding-select"
                      withoutErr={true}
                    />
                  </div>
                  <div>
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
                </div>
              </Form>
            </FormikProvider>
      </div>
  );
};
