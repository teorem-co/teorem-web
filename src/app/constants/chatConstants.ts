export interface IChatConversationItem {
    imgUrl: string;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: boolean;
}

export interface IChatConversation {
    incomingMessage: boolean;
    messages: string[];
    tutorImgUrl?: string;
}

export const chatConversationList: IChatConversationItem[] = [
    {
        imgUrl: 'https://source.unsplash.com/random/?girl',
        name: 'Johana Doe',
        lastMessage: 'Thank you :)',
        lastMessageTime: '12/3/2022',
        unread: false,
    },
    {
        imgUrl: 'https://source.unsplash.com/random/?woman',
        name: 'Cora Zainab',
        lastMessage: 'Hear you soon',
        lastMessageTime: '12/3/2022',
        unread: false,
    },
    {
        imgUrl: 'https://source.unsplash.com/random/?readhead',
        name: 'Elise Maria',
        lastMessage: 'When is the lecture?',
        lastMessageTime: '12/3/2022',
        unread: true,
    },
    {
        imgUrl: 'https://source.unsplash.com/random/?lady',
        name: 'April Frankie',
        lastMessage: 'I couldn`t solve problem...',
        lastMessageTime: '12/3/2022',
        unread: true,
    },
    {
        imgUrl: 'https://source.unsplash.com/random/?blondie',
        name: 'Libby Joyce',
        lastMessage: 'Please can you send me...',
        lastMessageTime: '12/3/2022',
        unread: false,
    },
    {
        imgUrl: 'https://source.unsplash.com/random/?model',
        name: 'Alexandra Emmie',
        lastMessage: 'Thank you :)',
        lastMessageTime: '12/3/2022',
        unread: false,
    },
];

export const chatConversation: IChatConversation[] = [
    {
        incomingMessage: true,
        tutorImgUrl: 'https://source.unsplash.com/random/?model',
        messages: [
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            'Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            'It has survived not only five centuries, but also the leap into electronic typesetting.',
        ],
    },
    {
        incomingMessage: false,
        messages: [
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            'Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            'It has survived not only five centuries, but also the leap into electronic typesetting.',
        ],
    },
];
