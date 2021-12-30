import { Form, FormikProvider, useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import heroImg from '../../../assets/images/hero-img.png';
import { useLoginMutation } from '../../../services/authService';
import TextField from '../../components/form/TextField';
import logo from './../../../assets/images/logo.svg';

interface Values {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const initialValues: Values = {
        email: '',
        password: '',
    };

    const [login] = useLoginMutation();

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            const data = {
                email: values.email,
                password: values.password,
            };
            login(data);
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Invalid email')
                .required('This field is required'),
            password: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('This field is required'),
        }),
    });

    return (
        <>
            <div className="login">
                <div className="login__aside">
                    <img src={heroImg} alt="Hero Img" />
                </div>
                <div className="login__content">
                    <div className="flex--grow w--448--max">
                        <div className="mb-22">
                            <img className="w--128" src={logo} alt="Theorem" />
                        </div>
                        <div className="type--lg type--wgt--bold mb-4">
                            Log in
                        </div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        htmlFor="email"
                                        className="field__label"
                                    >
                                        Email
                                    </label>
                                    <TextField
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="password"
                                    >
                                        Enter your Password
                                    </label>
                                    <TextField
                                        name="password"
                                        id="password"
                                        placeholder="Type your password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                    />
                                </div>
                                <button
                                    className="btn btn--base btn--primary w--100 mb-2 mt-6"
                                    type="submit"
                                >
                                    Register
                                </button>
                                <div
                                    onClick={() => alert('goBack')}
                                    className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                                >
                                    Forgot Password?
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="flex--primary mt-8 w--448--max">
                        <div className="type--color--tertiary">© Theorem</div>
                        <div>
                            Dont have an account?{' '}
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
