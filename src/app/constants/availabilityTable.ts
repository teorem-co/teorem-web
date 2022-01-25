import IAvailabilityItem from "../features/my-profile/interfaces/IAvailabilityItem";

const availabilityTable: (string | IAvailabilityItem)[][] = [
    ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    [
        'Pre 12 pm',
        {
            check: true,
            id: 'id'
        },
        {
            check: true,
            id: 'id'
        }, {
            check: false,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: false,
            id: 'id'
        },
    ],
    [
        '12 - 5 pm',
        {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        },
    ],
    [
        'After 5 pm',
        {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: false,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        }, {
            check: true,
            id: 'id'
        },
    ],
];

export default availabilityTable;