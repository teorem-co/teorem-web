import React from 'react';

import IFAQItem from '../interfaces/IFAQItem';
import FAQItem from './FAQItem';

const FAQContent: IFAQItem[] = [
    {
        id: 'faq-1',
        question: 'What is the price of instructions?',
        answer: 'lorem ipsum lorem ipsum',
    },
    {
        id: 'faq-2',
        question: 'What is a trial version?',
        answer: 'lorem ipsum lorem ipsum',
    },
    {
        id: 'faq-3',
        question: 'How the subscription works?',
        answer: 'lorem ipsum lorem ipsum',
    },
    {
        id: 'faq-4',
        question: 'What are the payment options?',
        answer: 'lorem ipsum lorem ipsum',
    },
    {
        id: 'faq-5',
        question: 'Can I listen to more subjects?',
        answer: 'lorem ipsum lorem ipsum',
    },
];

const FAQGroup = () => {
    return (
        <div className="landing__faq mt-10">
            {FAQContent.map((currentFAQItem: IFAQItem) => {
                return <FAQItem key={currentFAQItem.id} data={currentFAQItem} />;
            })}
        </div>
    );
};

export default FAQGroup;
