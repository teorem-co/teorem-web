import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import TextField from '../../../components/form/TextField';
import MainWrapper from '../../../components/MainWrapper';
import AddCreditCard from '../components/AddCreditCard';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';

interface Values {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfileAccount = () => {
    const { t } = useTranslation();

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [editSidebarOpen, setEditSidebarOpen] = useState(false);

    const initialValues: Values = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    const handleSubmit = (values: Values) => {
        const test = values;
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            currentPassword: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
            newPassword: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            confirmPassword: Yup.string().required(
                t('FORM_VALIDATION.REQUIRED')
            ),
        }),
    });

    const closeAddCardSidebar = () => {
        setAddSidebarOpen(false);
    };

    const closeEditCardSidebar = () => {
        setEditSidebarOpen(false);
    };

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-8" />

                <ProfileTabs />

                {/* PERSONAL INFO */}
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">
                            Change password
                        </div>
                        <div className="type--color--tertiary w--200--max">
                            Confirm your current password, then enter a new one.
                        </div>
                    </div>
                    <div className="w--800--max">
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="currentPassword"
                                                className="field__label"
                                            >
                                                Current Password
                                            </label>
                                            <TextField
                                                name="currentPassword"
                                                id="currentPassword"
                                                placeholder="Enter Current Password"
                                                password={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="newPassword"
                                                className="field__label"
                                            >
                                                New Password
                                            </label>
                                            <TextField
                                                name="newPassword"
                                                id="newPassword"
                                                placeholder="Enter New Password"
                                                password={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="field__label"
                                            >
                                                Confirm Password
                                            </label>
                                            <TextField
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                placeholder="Enter New Password"
                                                password={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn--primary btn--lg mt-2"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">Card details</div>
                        <div className="type--color--tertiary w--200--max">
                            Select default payment method or add new one.
                        </div>
                    </div>
                    <div className="dash-wrapper">
                        <div className="dash-wrapper__item">
                            <div
                                className="dash-wrapper__item__element"
                                onClick={() => setAddSidebarOpen(true)}
                            >
                                <div className="flex--primary cur--pointer">
                                    <div>
                                        <div className="type--wgt--bold">
                                            Add new Card
                                        </div>
                                        <div>Select to add new Card</div>
                                    </div>
                                    <div>
                                        <i className="icon icon--base icon--plus icon--primary"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Map through credit cards here, change dash-wrapper__item__element children layout to work with 3 child items (card image,card data and edit icon) */}
                    </div>
                </div>
            </div>
            <AddCreditCard
                closeSidebar={closeAddCardSidebar}
                sideBarIsOpen={addSidebarOpen}
            />
        </MainWrapper>
    );
};

export default ProfileAccount;
