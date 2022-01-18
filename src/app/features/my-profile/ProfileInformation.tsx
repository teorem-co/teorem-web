import { Form, FormikProvider, useFormik } from 'formik';
import { NavLink } from 'react-router-dom';

import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import MySelect from '../../components/MySelectField';
import { PATHS } from '../../routes';

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

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <div className="card--profile__section">
                    <div className="flex mb-8">
                        <div className="type--lg type--wgt--bold flex--grow">
                            My Profile
                        </div>
                        <div>
                            <button>Preview Profile</button>
                            <button>Save</button>
                        </div>
                    </div>
                    <div>
                        {/* add navlink classname and active classname */}
                        <NavLink exact to={PATHS.MY_PROFILE_INFO}>
                            <span>PERSONAL INFORMATION</span>
                        </NavLink>
                        <NavLink
                            exact
                            to={PATHS.MY_PROFILE_ACCOUNT}
                            className="ml-6"
                        >
                            <span>ACCOUNT</span>
                        </NavLink>
                    </div>
                </div>
                {/* PROGRESS */}
                <div className="card--profile__section flex--primary">
                    <div className="flex">
                        <div>Progress bar</div>
                        <div>Complete my profile</div>
                    </div>
                    <div className="flex">
                        <div>Personal information</div>
                        <div>Profile Picture</div>
                        <div>General Availability</div>
                        <div>My teachings</div>
                        <div>Aditional Information</div>
                    </div>
                </div>
                {/* PERSONAL INFO */}
                <div className="flex">
                    <div className="flex--grow">
                        <div className="mb-2 type--wgt--bold">
                            Personal Information
                        </div>
                        <div className="type--color--secondary">
                            Edit and update your personal information
                        </div>
                    </div>
                    <div className="flex--grow ml-8">
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="flex">
                                    <div className="field flex--grow w--448--max">
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
                                    <div className="field flex--grow ml-2 w--448--max">
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
                                <div className="flex">
                                    <div className="field flex--grow w--448--max">
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
                                    <div className="field flex--grow w--448--max ml-2">
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
                                <div className="field w--448--max">
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
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
                {/* PICTURE */}
                <div className="flex card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Profile Picture
                        </div>
                        <div className="type--color--secondary">
                            Upload or remove a new profile picture (PNG or JPG)
                        </div>
                    </div>
                    <div className="ml-8">Image</div>
                    <div className="ml-8">Drag and drop</div>
                </div>

                {/* AVAILABILITY */}
                <div className="flex card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            General Availability
                        </div>
                        <div className="type--color--secondary">
                            Edit and update your availability information
                        </div>
                    </div>
                    <div className="ml-8">TABLE</div>
                </div>
                {/* MY TEACHINGS */}
                <div className="flex card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">My teachings</div>
                        <div className="type--color--secondary">
                            Edit and update your teaching information
                        </div>
                    </div>
                    <div className="ml-8">FORM</div>
                </div>
                {/* ADDITIONAL INFO */}
                <div className="flex">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Additional information
                        </div>
                        <div className="type--color--secondary">
                            Edit and update your additional information
                        </div>
                    </div>
                    <div className="flex flex--col ml-2">
                        <div>TEXT BOX 1</div>
                        <div>TEXT BOX 2</div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default ProfileInformation;
