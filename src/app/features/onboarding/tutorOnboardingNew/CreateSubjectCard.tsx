import { Field, Form, FormikProvider, useFormik } from 'formik';
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
import MyTextField from '../../../components/form/MyTextField';
import {
  useLazyGetCountriesQuery,
} from '../../../features/onboarding/services/countryService';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { getUserId } from '../../../utils/getUserId';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';
import { BiSolidTrash } from 'react-icons/bi';
import { ITutorSubject } from '../../../../slices/onboardingSlice';
import { InputAdornment, TextField } from '@mui/material';

interface Props {
  // sideBarIsOpen: boolean;
  // closeSidebar: () => void;
  data: ITutorSubject;
  isLastForm: boolean;
  updateForm: (id:number|string, newValues: ITutorSubject) => void;
  id:number | string;
  handleGetData: () => void;
  tutorId?: string;
  removeItem: (id: number|string) => void;
}

interface Values {
  level: string;
  subject: string;
  price: string;
}
export const CreateSubjectCard = (props: Props) => {
      const {data, isLastForm, updateForm, id, removeItem, handleGetData } = props;

      const { data: subjectOptions, isLoading: isLoadingSubjects } = useGetSubjectsQuery();
      const { data: levelOptions, isLoading: isLoadingLevels } = useGetLevelsQuery();

      const [createSubject, {isSuccess}] = useCreateSubjectMutation();


      const [getProfileProgress] = useLazyGetProfileProgressQuery();

      const levelDisabled = !levelOptions || isLoadingLevels;
      const { t } = useTranslation();
      const dispatch = useAppDispatch();
      const profileProgressState = useAppSelector((state) => state.myProfileProgress);
      const initialValues: Values = {
      level: data.levelId,
      subject: data.subjectId,
      price: data.price,
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
      onSubmit: handleSubmit,
      initialValues: initialValues,
        validateOnChange: true,
        validateOnBlur:true,
      validationSchema: Yup.object().shape({
      level: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      subject: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      price: Yup.number().required(t('FORM_VALIDATION.REQUIRED')).min(minPrice, t('FORM_VALIDATION.PRICE') + minPrice),
    }),
    });

      useEffect(() => {
      getCurrency();
    }, []);


  useEffect(() => {
    updateForm(id, {
      id: id,
      price: formik.values.price,
      subjectId:formik.values.subject,
      levelId:formik.values.level
    });
  }, [formik.values]);

  return (
      <div className="card--primary mt-1 flex flex--jc--space-around">
            <FormikProvider value={formik}>
              <Form noValidate>
                <div
                  style={{gap: '10px'}}
                  className="subject-form-container field__w-fit-content flex--ai--center ">
                  <div>
                    <MySelect
                      className="flex--grow w--220--min w--220--max mb-5"
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
                      className="w--220--min w--220--max mb-5 test_style"
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
                      withoutErr={true}
                    />
                  </div>
                  <div >
                   <div className="">
                     <Field
                     as={TextField}
                     name="price"
                     id="price"
                     placeholder={
                       t('MY_PROFILE.MY_TEACHINGS.PRICING_PLACEHOLDER')}
                     // withoutErr={true}
                     type="number"
                     InputProps={{
                       style: { fontFamily: "'Lato', sans-serif", backgroundColor:'white', height:'38px', width:'100px', paddingTop:0,paddingBottom:0, alignItems:'center', display:'flex' },
                       startAdornment: <InputAdornment style={{paddingBottom:0, marginBottom:0}} position="start">€</InputAdornment>,
                     }}
                     helperText={(formik.touched.price && formik.errors.price) ? formik.errors.price : ' '}
                     error={formik.touched.price && Boolean(formik.errors.price)}
                     FormHelperTextProps={{ style: { padding:0, height: formik.touched.price && formik.errors.price ? 'auto' : '18px' } }}
                   />
                   </div>
                  </div>
                  <div className="type--center mb-5 type--md">
                    /h
                  </div>
                  <BiSolidTrash
                    size={18}
                    className={` ${isLastForm ? 'disabled-color' : 'primary-color'}  cur--pointer icon-transition mb-5`}
                    onClick={() => {
                      if(!isLastForm)
                        removeItem(id);
                    }}
                  />
                </div>
              </Form>
            </FormikProvider>
      </div>
  );
};
