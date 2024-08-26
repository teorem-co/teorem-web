import moment from 'moment';
import IBooking from '../../../types/IBooking';

const TUTORIAL_SCHEDULE: IBooking = {
    id: 'mockSchedule',
    userFullName: 'Ana Anić',
    Tutor: {
        userId: 'tutorid',
        currentOccupation: 'ocupation',
        yearsOfExperience: 'experience',
        aboutTutor: 'about tutor',
        aboutLessons: 'about lessons',
        User: {
            id: 'userId',
            roleId: 'roleid',
            dateOfBirth: '1998-06-22',
            phonePrefix: '385',
            profileImage: 'profileImg',
            childIds: [],
            stripeCustomerId: 'stripecustid',
            stripeAccountId: 'stripeaccid',
            stripeConnected: true,
            Country: {
                currencyCode: 'currency code',
                currencyName: 'currency name',
            },
            email: 'stela.gasi8@gmail.com',
            firstName: 'Ana',
            lastName: 'Anić',
            countryId: 'da98ad50-5138-4f0d-b297-62c5cb101247',
            phoneNumber: '38598718823',
            Role: {
                name: 'name',
                id: 'roleid',
                abrv: 'student',
            },
        },
        TutorSubjects: [],
        minimumPrice: 10,
        maximumPrice: 15,
        averageGrade: 5,
        completedLessons: 1,
        Bookings: [],
        disabled: false,
        slug: 'slug',
    },
    User: {
        id: 'userId',
        roleId: 'roleid',
        dateOfBirth: '1998-06-22',
        phonePrefix: '385',
        profileImage: 'profileImg',
        childIds: [],
        stripeCustomerId: 'stripecustid',
        stripeAccountId: 'stripeaccid',
        stripeConnected: true,
        Country: {
            currencyCode: 'currency code',
            currencyName: 'currency name',
        },
        email: 'stela.gasi8@gmail.com',
        firstName: 'Ana',
        lastName: 'Anić',
        countryId: 'da98ad50-5138-4f0d-b297-62c5cb101247',
        phoneNumber: '38598718823',
        Role: {
            name: 'name',
            id: 'roleid',
            abrv: 'student',
        },
    },
    tutorId: '6ab33036-3204-4ab0-9a4b-a1016c77e63c',
    studentId: '8eb6b506-5fea-4709-9fd3-79d27869ff96',
    subjectId: '2da9dfdb-e9cc-479a-802d-fa2a9b906575',
    levelId: 'bb589332-eb38-4455-9259-1773bf88d60a',
    startTime: moment().toISOString(),
    endTime: moment().add(50, 'minutes').toISOString(),
    isAccepted: true,
    inReschedule: false,
    Level: {
        id: 'bb589332-eb38-4455-9259-1773bf88d60a',
        abrv: 'high-school',
        name: 'High School',
        countryId: "da98ad50-5138-4f0d-b297-62c5cb101247"
    },
    Subject: {
        id: '2da9dfdb-e9cc-479a-802d-fa2a9b906575',
        abrv: 'maths',
        name: 'Maths',
        countryId: "da98ad50-5138-4f0d-b297-62c5cb101247"
    },
};

export default TUTORIAL_SCHEDULE;
