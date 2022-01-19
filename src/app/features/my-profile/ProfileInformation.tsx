import { Form, FormikProvider, useFormik } from 'formik';

import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import ProfileCompletion from './components/ProfileCompletion';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';

interface Values {
    firstName: string;
    lastName: string;
}

//ADD TRANSLATIONS
const ProfileInformation = () => {
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

    const availabilityTable = [
        ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        [
            'Pre 12 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--close"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
        [
            '12 - 5 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--close"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
        [
            'After 5 pm',
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
            <i className="icon icon--base icon--check"></i>,
        ],
    ];

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

                {/* PICTURE */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Profile Picture
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Upload or remove a new profile picture (PNG or JPG)
                        </div>
                    </div>
                    <div>
                        <div>Image</div>
                        <div>Drag and drop</div>
                    </div>
                </div>

                {/* AVAILABILITY */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            General Availability
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your availability information
                        </div>
                    </div>
                    <div>
                        <table>
                            {availabilityTable.map((row: any) => {
                                return (
                                    <tr>
                                        {row.map((column: number) => {
                                            return <td>{column}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </div>

                {/* MY TEACHINGS */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">My teachings</div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your teaching information
                        </div>
                    </div>
                    <div>FORM</div>
                </div>

                {/* ADDITIONAL INFO */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Additional information
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Edit and update your additional information
                        </div>
                    </div>
                    <div>
                        <div className="field">
                            <label
                                className="field__label"
                                htmlFor="about-input"
                            >
                                Tell us more about yourself*
                            </label>
                            <textarea
                                placeholder="What describes you best, what are your hobbies, approach..."
                                className="input input--base input--textarea"
                                id="about-input"
                            />
                        </div>
                        <div className="field">
                            <label
                                className="field__label"
                                htmlFor="about-lession-input"
                            >
                                Tell us more about your lessons**
                            </label>
                            <textarea
                                placeholder="Describe your lessons, approach, way of teaching..."
                                className="input input--base input--textarea"
                                id="about-lession-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default ProfileInformation;
