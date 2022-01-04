export default interface IBooking {
    id: string;
    level: {
        abrv: string;
        id: string;
        name: string;
    };
    subject: {
        abrv: string;
        id: string;
        name: string;
    };
    tutor: {
        aboutLessons: string;
        aboutTutor: string;
        currentOccupation: string;
        userId: string;
        levelId: string;
        yearsOfExperience: string;
    };
    user: {
        countryId: null;
        dateOfBirth: null;
        email: string;
        firstName: string;
        id: string;
        lastname: string;
        parentId: null;
        password: string;
        passwordResetToken: string;
        phoneNumber: null;
        phonePrefix: null;
        roleId: string;
    }
    tutorId: string;
    studentId: string;
    subjectId: string;
    levelId: string;
    startTime: string;
    endTime: string;
}
