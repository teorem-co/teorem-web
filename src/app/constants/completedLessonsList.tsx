export interface ICompletedLesson {
    id: string;
    tutorImg: string;
    subject: string;
    tutorName: string;
    lessonsCount: number;
}

const completedLessonsList: ICompletedLesson[] = [
    {
        id: 'tutor-01',
        tutorImg: 'https://source.unsplash.com/random/300×300',
        subject: 'Mathematics',
        tutorName: 'Maria Diaz',
        lessonsCount: 3,
    },
    {
        id: 'tutor-02',
        tutorImg: 'https://source.unsplash.com/random/300×300',
        subject: 'English',
        tutorName: 'Rose Pruti',
        lessonsCount: 2,
    },
    {
        id: 'tutor-03',
        tutorImg: 'https://source.unsplash.com/random/300×300',
        subject: 'Geology',
        tutorName: 'Alexandra Hulka',
        lessonsCount: 4,
    },
];

export default completedLessonsList;
