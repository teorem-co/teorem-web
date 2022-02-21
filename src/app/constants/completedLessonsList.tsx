export interface ICompletedLessonMock {
    id: string;
    tutorImg: string;
    subject: string;
    tutorName: string;
    lessonsCount: number;
    lessons: IVideoLesson[];
}

export interface IVideoLesson {
    id: string;
    name: string;
    date: string;
}

const completedLessonsList: ICompletedLessonMock[] = [
    {
        id: 'tutor-01',
        tutorImg: 'https://source.unsplash.com/random/300×300/?teacher',
        subject: 'Mathematics',
        tutorName: 'Maria Diaz',
        lessonsCount: 3,
        lessons: [
            {
                id: 'video-1',
                name: 'Lesson 1',
                date: '13/Jan/2020',
            },
            {
                id: 'video-2',
                name: 'Lesson 2',
                date: '15/Jan/2020',
            },
            {
                id: 'video-3',
                name: 'Lesson 3',
                date: '19/Jan/2020',
            },
        ],
    },
    {
        id: 'tutor-02',
        tutorImg: 'https://source.unsplash.com/random/300×300/?model',
        subject: 'English',
        tutorName: 'Rose Pruti',
        lessonsCount: 2,
        lessons: [
            {
                id: 'video-1',
                name: 'Lesson 1',
                date: '13/Jan/2020',
            },
            {
                id: 'video-2',
                name: 'Lesson 2',
                date: '15/Jan/2020',
            },
        ],
    },
    {
        id: 'tutor-03',
        tutorImg: 'https://source.unsplash.com/random/300×300/?lady',
        subject: 'Geology',
        tutorName: 'Alexandra Hulka',
        lessonsCount: 4,
        lessons: [
            {
                id: 'video-1',
                name: 'Lesson 1',
                date: '13/Jan/2020',
            },
            {
                id: 'video-2',
                name: 'Lesson 2',
                date: '15/Jan/2020',
            },
            {
                id: 'video-3',
                name: 'Lesson 3',
                date: '19/Jan/2020',
            },
            {
                id: 'video-4',
                name: 'Lesson 4',
                date: '19/Jan/2020',
            },
        ],
    },
];

export default completedLessonsList;
