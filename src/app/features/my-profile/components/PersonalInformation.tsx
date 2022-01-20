import { Form, FormikProvider, useFormik } from 'formik';

import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import ProfileCompletion from './ProfileCompletion';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';

interface Values {
    firstName: string;
    lastName: string;
}

const PersonalInformation = () => {
    const initialValues = {
        firstName: '',
        lastName: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            //
        },
    });

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PROGRESS */}
                <ProfileCompletion />

                {/* PERSONAL INFO */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Personal Information
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your personal information
                        </div>
                    </div>
                    <div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="firstName"
                                                className="field__label"
                                            >
                                                First Name
                                            </label>
                                            <TextField
                                                name="firstName"
                                                id="firstName"
                                                placeholder="Enter your first name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="lastName"
                                                className="field__label"
                                            >
                                                Last Name
                                            </label>
                                            <TextField
                                                name="lastName"
                                                id="lastName"
                                                placeholder="Enter your first name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="phoneNumber"
                                                className="field__label"
                                            >
                                                Phone Number*
                                            </label>
                                            <TextField
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                placeholder="Enter your phone name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="country"
                                                className="field__label"
                                            >
                                                Select country
                                            </label>
                                            <TextField
                                                name="country"
                                                id="country"
                                                placeholder="Enter your country name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="birthDate"
                                                className="field__label"
                                            >
                                                Date of Birth*
                                            </label>
                                            <TextField
                                                name="birthDate"
                                                id="birthDate"
                                                placeholder="Enter your birthDate name"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default PersonalInformation;
