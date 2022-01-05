export interface IUpcomingLessons {
    id: string;
    tutorId: string;
    studentId: string;
    subjectId: string;
    levelId: string;
    startTime: string;
    endTime: string;
    User: {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        passwordResetToken: string;
        roleId: string;
        countryId: null;
        phoneNumber: null;
        phonePrefix: null;
        parentId: null;
        dateOfbirth: null;
    };
}

