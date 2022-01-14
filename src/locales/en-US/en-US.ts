export const EN_US = {
    MAIN_TITLE: 'Teorem',
    WATERMARK: '© Teorem',
    ERROR_HANDLING: {
        UNHANDLED_ERROR: 'Unhandled error occured!',
    },
    FORM_VALIDATION: {
        INVALID_EMAIL: 'Invalid email',
        TOO_SHORT: 'Too Short!',
        TOO_LONG: 'Too Long!',
        REQUIRED: 'This field is required',
        LOWERCASE: 'Include at least one lowercase letter (a-z)',
        UPPERCASE: 'Include at least one uppercase letter (A-Z)',
        NUMBER: 'Include at least one number (0-9)',
        MIN_CHARACTERS: 'Be a minimum of 8 characters',
        SPECIAL_CHAR:
            'Include at least one special character (@, $, !, %, *, ?, &)',
        PASSWORD_MUST: 'Password must',
        PASSWORD_MATCH: 'Passwords must match',
        PASSWORD_STRENGTH: 'Password must meet the conditions',
    },
    //add seatch tutors translations
    SEARCH_TUTORS: {
        AVAILABILITY: {
            TIME_OF_DAY: {
                LABEL: 'Time of day',
                BEFORE_NOON: 'Pre 12 pm',
                NOON_TO_FIVE: '12 - 5 pm',
                AFTER_FIVE: 'After 5 pm',
            },
            DAY_OF_WEEK: {
                LABEL: 'Day of week',
                MON: 'mon',
                TUE: 'tue',
                WED: 'wed',
                THU: 'thu',
                FRI: 'fri',
                SAT: 'sat',
                SUN: 'sun',
            },
        },
        PLACEHOLDER: {
            LEVEL: 'Level',
            SUBJECT: 'Subject',
            AVAILABILITY: 'Custom availability',
        },
        NO_OPTIONS_MESSAGE: 'Please select level first',
        TUTOR_LIST: 'Tutor list',
        RESET_FILTER: 'Reset filter',
        TUTOR_AVAILABLE: 'Tutor Available',
    },
    ROLE_SELECTION: {
        TITLE: 'Register',
        ACTION: 'I want to register as a',
        ACCOUNT: 'Already have an account?',
        LOG_IN: 'Log in',
        STUDENT_TITLE: 'Student',
        STUDENT_DESCRIPTION: 'Here to expand my knowledge.',
        PARENT_TITLE: 'Parent / Guardian',
        PARENT_DESCRIPTION: 'Here to help my child learn.',
        TUTOR_TITLE: 'Tutor',
        TUTOR_DESCRIPTION: 'Here to teach students what I know.',
    },
    RESET_PASSWORD: {
        TITLE: 'Forgot Password',
        FORM: {
            EMAIL: 'Email',
            ENTER_MAIL: 'Enter Email',
            SUBMIT_BTN: 'Reset Password',
        },
        BACK_BTN: 'Back to Login',
    },
    LOGIN: {
        TITLE: 'Log in',
        FORM: {
            EMAIL: 'Email',
            PASSWORD: 'Enter your Password',
            SUBMIT_BTN: 'Log in',
        },
        FORGOT_PASSWORD: 'Forgot Password?',
        ACCOUNT: 'Dont have an account?',
        REGISTER: 'Register',
    },
    BACKEND_ERRORS: {
        BASE: {
            UNAUTHORIZED: 'You are not authorized.',
            FORBIDDED: 'You do not have permission.',
            NOT_FOUND: 'Resource not found',
            CONFLICT: 'Resource already exists',
            INTERNAL_ERROR: 'Server error',
            BAD_REQUEST: 'Bad request',
        },
        USER: {
            EMAIL_CONFLICT: 'User with this email already exists',
            LOGIN_WRONG_FORM_DATA: 'Wrong email or password',
            NOT_FOUND: 'User not found',
        },
        LEVEL: {
            NOT_FOUND: 'Level not found',
        },
        FILE: {
            NOT_FOUND: 'File not found',
        },
        SUBJECT: {
            NOT_FOUND: 'Subject not found',
        },
        TUTOR: {
            NOT_FOUND: 'Tutor not found',
        },
        TUTOR_AVAILABILITY: {
            CONFLICT: 'Tutor availability has already been set',
            NOT_FOUND: 'Tutor availability not found',
        },
        BOOKING: {
            NOT_FOUND: 'Booking not found',
        },
        ROLE: {
            NOT_FOUND: 'Role not found',
        },
    },
    NOT_FOUND: {
        TITLE: 'Page not found',
        SUBTITLE:
            ' Sorry,looks like we sent you the wrong way. Let us guide you back!',
        BACK_BUTTON: 'Back to home',
    },
    UPCOMING_LESSONS: {
        TITLE: 'UPCOMING EVENTS',
    },
    REGISTER: {
        TITLE: 'Register as {{role}}',
        FORM: {
            FIRST_NAME: 'First Name*',
            LAST_NAME: 'Last Name*',
            EMAIL: 'Email*',
            PASSWORD: 'Choose Password*',
            CONFIRM_PASSWORD: 'Repeat Password*',
            SUBMIT_BUTTON: 'Register',
        },
        BACK_BUTTON: 'Back to selection',
    },
    MY_BOOKINGS: {
        TITLE: 'Calendar',
        NOTIFICATION_PART_1: 'You have ',
        NOTIFICATION_PART_2: ' Lesson(s) today!',
    },
};
