import React from 'react';

const FAQGroup = () => {
    return (
        <div className="landing__faq">
            <div className="flex--primary p-3 p-md-6">
                <div className="flex--grow type--color--secondary">
                    What is the price of instructions?
                </div>
                <div className="flex--shrink">
                    <i className="icon icon--sm icon--black icon--plus"></i>
                </div>
            </div>
            <div className="flex--primary p-3 p-md-6">
                <div className="flex--grow type--color--secondary">
                    What is a trial version?
                </div>
                <div className="flex--shrink">
                    <i className="icon icon--sm icon--black icon--plus"></i>
                </div>
            </div>
            <div className="flex--primary p-3 p-md-6">
                <div className="flex--grow type--color--secondary">
                    How the subscription works?
                </div>
                <div className="flex--shrink">
                    <i className="icon icon--sm icon--black icon--plus"></i>
                </div>
            </div>
            <div className="flex--primary p-3 p-md-6 ">
                <div className="flex--grow type--color--secondary">
                    What are the payment options?
                </div>
                <div className="flex--shrink">
                    <i className="icon icon--sm icon--black icon--plus"></i>
                </div>
            </div>
            <div className="flex--primary p-3 p-md-6">
                <div className="flex--grow type--color--secondary">
                    Can I listen to more subjects?
                </div>
                <div className="flex--shrink">
                    <i className="icon icon--sm icon--black icon--plus"></i>
                </div>
            </div>
        </div>
    );
};

export default FAQGroup;
