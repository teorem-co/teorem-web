import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import * as Yup from 'yup';

import { useGetLevelOptionsQuery } from '../../../../services/levelService';
import MySelect from '../../../components/form/MySelectField';

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
}

const ParentCalendarSlots: React.FC<IProps> = (props) => {
    const { start, end, handleClose } = props;
    const { data: levelOptions, isLoading: isLoadingLevels } =
        useGetLevelOptionsQuery();

    const initialValues = {
        level: '',
        subject: '',
        child: '',
        time: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    return (
        <div className="modal modal--parent">
            <div className="modal--parent__header">
                <div className="flex flex--primary">
                    <div>
                        <div className="type--wgt--bold type--md mb-1">
                            Book a Slot
                        </div>
                        <div className="type--color--secondary">
                            {start} - {end}
                        </div>
                    </div>
                    <i
                        className="icon icon--base icon--close icon--grey"
                        onClick={() =>
                            handleClose ? handleClose(false) : false
                        }
                    ></i>
                </div>
            </div>

            <div className="modal--parent__line"></div>

            <div className="modal--parent__body">
                <FormikProvider value={formik}>
                    <Form>
                        <div className="field">
                            <label htmlFor="countryId" className="field__label">
                                Level*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('level')}
                                form={formik}
                                meta={formik.getFieldMeta('level')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={levelOptions ? levelOptions : []}
                                // isDisabled={levelDisabled}
                                placeholder="Select Level"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="countryId" className="field__label">
                                Subject*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('level')}
                                form={formik}
                                meta={formik.getFieldMeta('level')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={levelOptions ? levelOptions : []}
                                // isDisabled={levelDisabled}
                                placeholder="Select Subject"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="countryId" className="field__label">
                                Child*
                            </label>

                            <MySelect
                                field={formik.getFieldProps('level')}
                                form={formik}
                                meta={formik.getFieldMeta('level')}
                                classNamePrefix="onboarding-select"
                                isMulti={false}
                                options={levelOptions ? levelOptions : []}
                                // isDisabled={levelDisabled}
                                placeholder="Select Child"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="countryId" className="field__label">
                                Time* (Session length is 50min)
                            </label>
                            <div className="flex">
                                <div className="field w--100 mr-6">
                                    <MySelect
                                        field={formik.getFieldProps('level')}
                                        form={formik}
                                        meta={formik.getFieldMeta('level')}
                                        classNamePrefix="onboarding-select"
                                        isMulti={false}
                                        options={
                                            levelOptions ? levelOptions : []
                                        }
                                        // isDisabled={levelDisabled}
                                        placeholder={t(
                                            'SEARCH_TUTORS.PLACEHOLDER.LEVEL'
                                        )}
                                    />
                                </div>
                                <div className="field w--100">
                                    <MySelect
                                        field={formik.getFieldProps('level')}
                                        form={formik}
                                        meta={formik.getFieldMeta('level')}
                                        classNamePrefix="onboarding-select"
                                        isMulti={false}
                                        options={
                                            levelOptions ? levelOptions : []
                                        }
                                        // isDisabled={levelDisabled}
                                        placeholder={t(
                                            'SEARCH_TUTORS.PLACEHOLDER.LEVEL'
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <div className="modal--parent__footer">
                <button className="btn btn--base btn--primary mb-1">
                    Book
                </button>
                <button className="btn btn--base btn--clear">Cancel</button>
            </div>
        </div>
    );
};

export default ParentCalendarSlots;
