export interface IRatings {
    id: string;
    ratings: number;
    label: string;
}
const ratingsMock: IRatings[] = [
    {
        id: 'rating-1',
        ratings: 24,
        label: '5 stars',
    },
    {
        id: 'rating-2',
        ratings: 5,
        label: '4 stars',
    },
    {
        id: 'rating-3',
        ratings: 29,
        label: '3 stars',
    },
    {
        id: 'rating-4',
        ratings: 0,
        label: '2 stars',
    },
    {
        id: 'rating-5',
        ratings: 1,
        label: '1 stars',
    },
];

export default ratingsMock;
