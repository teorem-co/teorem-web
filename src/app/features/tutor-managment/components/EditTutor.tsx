import * as React from 'react';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { Form, FormikProvider, useFormik } from 'formik';
import TextField from '../../../components/form/TextField';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import {
  ICountry,
  useLazyGetCountriesQuery,
} from '../../onboarding/services/countryService';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyTextArea from '../../../components/form/MyTextArea';
import { useEditTutorMutation } from '../../../../services/tutorService';
import UploadFile from '../../../components/form/MyUploadField';
import moment from 'moment/moment';

export function EditTutor({ tutorData, setRefetch }: any) {
  const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
  const [editTutor] = useEditTutorMutation();
  const [opened, setOpened] = useState(false);
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const formik = useFormik({
    initialValues: {
      firstName: tutorData.User.firstName,
      lastName: tutorData.User.lastName,
      dateOfBirth: tutorData.User.dateOfBirth,
      phoneNumber: tutorData.User.phoneNumber,
      profileImage: tutorData.User.profileImage ? tutorData.User.profileImage : '',
      countryId: tutorData.User.countryId,
      disabled: tutorData.disabled,
      currentOccupation: tutorData.currentOccupation,
      yearsOfExperience: tutorData.yearsOfExperience,
      aboutTutor: tutorData.aboutTutor,
      aboutLessons: tutorData.aboutLessons,
    },
    onSubmit: (values) => {
      editTutor({ ...values, tutorId: tutorData.User.id, dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD') }).then(() => {
        setOpened(false);
        setRefetch((prevState: number) => prevState + 1);
      });
    },
  });
  useEffect(() => {
    async function fetchCountries() {
      getCountries();
    }
    fetchCountries();
  }, []);
  useEffect(() => {
    const currentCountries: OptionType[] = countries
      ? countries.map((x: ICountry) => {
          return {
            label: x.name,
            value: x.id,
            icon: x.flag,
          };
        })
      : [];
    setCountryOptions(currentCountries);
  }, [countries]);
  return (
    <>
      {opened && (
        <div className="modal__overlay">
          <div className="modal">
            <div className="modal__head">
              <div className="type--md type--wgt--bold">Edit tutor details</div>
              <i
                onClick={() => {
                  setOpened(false);
                }}
                className="modal__close icon icon--base icon--close icon--grey"
              ></i>
            </div>
            <div className="modal__separator"></div>
            <div className="modal__body">
              <FormikProvider value={formik}>
                <Form>
                  <div className="row">
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label htmlFor="firstName" className="field__label">
                          {t('MY_PROFILE.PROFILE_SETTINGS.FIRST_NAME')}
                        </label>
                        <TextField name="firstName" id="firstName" placeholder={t('MY_PROFILE.PROFILE_SETTINGS.FIRST_NAME_PLACEHOLDER')} />
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label htmlFor="lastName" className="field__label">
                          {t('MY_PROFILE.PROFILE_SETTINGS.LAST_NAME')}
                        </label>
                        <TextField name="lastName" id="lastName" placeholder={t('MY_PROFILE.PROFILE_SETTINGS.LAST_NAME_PLACEHOLDER')} />
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                          {t('REGISTER.FORM.PHONE_NUMBER')}
                        </label>
                        <MyPhoneInput
                          form={formik}
                          name="phoneNumber"
                          field={formik.getFieldProps('phoneNumber')}
                          meta={formik.getFieldMeta('phoneNumber')}
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label htmlFor="countryId" className="field__label">
                          {t('MY_PROFILE.PROFILE_SETTINGS.COUNTRY')}
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
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                          {t('MY_PROFILE.PROFILE_SETTINGS.BIRTHDAY')}
                        </label>
                        <MyDatePicker form={formik} field={formik.getFieldProps('dateOfBirth')} meta={formik.getFieldMeta('dateOfBirth')} />
                      </div>
                    </div>
                    <div className="col col-12">
                      <div className="field field__file">
                        <UploadFile
                          setFieldValue={formik.setFieldValue}
                          id="profileImage"
                          name="profileImage"
                          value={tutorData.User?.profileImage ? tutorData.User.profileImage : ''}
                          imagePreview={formik.values.profileImage}
                          removePreviewOnUnmount={true}
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                          {t('MY_PROFILE.TUTOR_DISABLE.TITLE')}
                        </label>
                        <div
                          className={`btn btn--base btn--${formik.values.disabled ? 'primary' : 'disabled'} mr-2`}
                          onClick={() => {
                            formik.setFieldValue('disabled', true);
                          }}
                        >
                          {t('MY_PROFILE.TUTOR_DISABLE.NO')}
                        </div>
                        <div
                          className={`btn btn--base btn--${!formik.values.disabled ? 'primary' : 'disabled'} mr-2`}
                          onClick={() => {
                            formik.setFieldValue('disabled', false);
                          }}
                        >
                          {t('MY_PROFILE.TUTOR_DISABLE.YES')}
                        </div>
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label className="field__label" htmlFor="currentOccupation">
                          {t('MY_PROFILE.ABOUT_ME.OCCUPATION')}
                        </label>
                        <TextField
                          maxLength={50}
                          id="currentOccupation"
                          wrapperClassName="flex--grow"
                          name="currentOccupation"
                          placeholder={t('MY_PROFILE.ABOUT_ME.OCCUPATION_PLACEHOLDER')}
                          className="input input--base"
                        />
                      </div>
                    </div>
                    <div className="col col-12 col-xl-6">
                      <div className="field">
                        <label className="field__label" htmlFor="yearsOfExperience">
                          {t('MY_PROFILE.ABOUT_ME.YEARS')}
                        </label>
                        <TextField
                          maxLength={50}
                          id="yearsOfExperience"
                          wrapperClassName="flex--grow"
                          name="yearsOfExperience"
                          placeholder={t('MY_PROFILE.ABOUT_ME.YEARS_PLACEHOLDER')}
                          className="input input--base"
                          type={'number'}
                        />
                      </div>
                    </div>
                    <div className="col col-12">
                      <div className="field">
                        <label className="field__label" htmlFor="aboutTutor">
                          {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_LABEL')}
                        </label>
                        <MyTextArea
                          maxLength={2500}
                          name="aboutTutor"
                          placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_TUTOR_PLACEHOLDER')}
                          id="aboutTutor"
                        />
                      </div>
                    </div>
                    <div className="col col-12">
                      <div className="field">
                        <label className="field__label" htmlFor="aboutLessons">
                          {t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_LABEL')}
                        </label>
                        <MyTextArea
                          maxLength={2500}
                          name="aboutLessons"
                          placeholder={t('SEARCH_TUTORS.TUTOR_PROFILE.FORM.ABOUT_LESSONS_PLACEHOLDER')}
                          id="aboutLessons"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button type="submit" className="btn btn--base btn--primary w--100">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        formik.resetForm();
                        setOpened(false);
                      }}
                      className="btn btn--base btn--clear w--100"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </div>
        </div>
      )}
      <button className="btn btn--base btn--ghost w--100 type--center flex flex--center flex--jc--center mt-2" onClick={() => setOpened(true)}>
        <span>Edit details</span>
      </button>
    </>
  );
}
