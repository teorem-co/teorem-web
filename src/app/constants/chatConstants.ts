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
        tutorImgUrl: 'https://source.unsplash.com/random/?girl',
        messages: ['Can you confirm that new time is OK with you?', 'and please leave a review after a lesson that will help me a lot. Thank you'],
    },
    {
        incomingMessage: false,
        messages: ['Ohh yes, i will do that now! Thank you for reminding me', 'I will leave a review for you.'],
    },
    {
        incomingMessage: true,
        tutorImgUrl: 'https://source.unsplash.com/random/?girl',
        messages: ['Thank you :)'],
    },
];
