import heroImg from '../../../assets/images/hero-img.png';
import logo from './../../../assets/images/logo.svg';
import { Form, useFormik, FormikProvider } from 'formik';
import TextField from '../../components/form/TextField';
import * as Yup from 'yup';

interface Props { }

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

const Register: React.FC<Props> = (props: Props) => {

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('This field is required'),
            lastName: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('This field is required'),
            email: Yup.string()
                .email('Invalid email')
                .required('This field is required'),
            password: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('This field is required'),
            passwordRepeat: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('This field is required'),
        })
    });

    return <>
        <div className="login">
            <div className="login__aside">
                <img src={heroImg} alt="Hero Img" />
            </div>
            <div className="login__content">
                <div className="flex--grow w--448--max">
                    <div className="mb-22"><img className="w--128" src={logo} alt="Theorem" /></div>
                    <div className="type--lg type--wgt--bold mb-4">Register as (role)</div>
                    <FormikProvider value={formik} >
                        <Form>
                            <div className="field">
                                <label htmlFor="firstName" className="field__label">First Name*</label>
                                <TextField
                                    name="firstName"
                                    id="firstName"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="lastName" className="field__label">Last name*</label>
                                <TextField
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Enter your last name"
                                />
                            </div>
                            <div className="field">
                                <label className="field__label" htmlFor="email">Email*</label>
                                <TextField
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="field">
                                <label className="field__label" htmlFor="password">Choose Password*</label>
                                <TextField
                                    name="password"
                                    id="password"
                                    placeholder="Type your password"
                                    className="input input--base input--text input--icon"
                                    password={true}
                                />
                            </div>
                            <div className="field">
                                <label className="field__label" htmlFor="passwordRepeat">Choose Password*</label>
                                <TextField
                                    name="passwordRepeat"
                                    id="passwordRepeat"
                                    placeholder="Type your password"
                                    className="input input--base input--text input--icon"
                                    password={true}
                                />
                            </div>
                            <button className="btn btn--base btn--primary w--100 mb-2 mt-6" type="submit">Register</button>
                            <div onClick={() => alert('goBack')} className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center">
                                <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> Back to selection
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className='mt-8'>
                    <div>© Theorem</div>
                </div>
            </div>
        </div>
    </>
}

export default Register;