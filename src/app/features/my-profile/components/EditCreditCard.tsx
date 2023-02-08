import React from 'react';

interface Values {
    cardFirstName: string;
    cardLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
}

interface Props {
    sideBarIsOpen: boolean;
    closeSidebar: () => void;
}

const EditCreditCard = (props: Props) => {
    const { closeSidebar, sideBarIsOpen } = props;

    return <div></div>;
};

export default EditCreditCard;
