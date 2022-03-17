import { useState } from 'react';

import IFAQItem from '../interfaces/IFAQItem';

interface Props {
    data: IFAQItem;
}

const FAQItem = (props: Props) => {
    const { question, answer } = props.data;

    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <>
            <div>
                <div className="flex--primary p-3 p-md-6 cur--pointer" onClick={() => setIsActive(!isActive)}>
                    <div className="flex--grow type--color--secondary">{question}</div>
                    <div className="flex--shrink">
                        <i className={`icon icon--base icon--black ${isActive ? 'icon--minus' : 'icon--plus'}`}></i>
                    </div>
                </div>
                {isActive && <div className="p-3 pt-0 p-md-6 type--md type--color--secondary">{answer}</div>}
            </div>
        </>
    );
};

export default FAQItem;
