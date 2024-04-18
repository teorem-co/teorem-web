import { t } from 'i18next';
import React, { useState } from 'react';
import toastService from '../../services/toastService';
import { useAppSelector } from '../../hooks';
import IWeek from './interfaces/IWeek';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { getCurrencySymbol } from '../../components/countries';

interface PayoutsProps {
    month: string;
    bookingsNum: number;
    studentsNum: number;
    reviewsNum: number;
    revenue: number;
    weeks?: IWeek[];
}

const fileUrl = 'api/v1/tutors';
const url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_CHAT_FILE_DOWNLOAD_HOST}/${fileUrl}`;

const PayoutsTableElement = (props: PayoutsProps) => {
    const [accordion, setAccordion] = useState(false);
    const userToken = useAppSelector((state) => state.auth.token);
    const countryId = useAppSelector((state) => state?.user?.user?.countryId);

    const changeAccordion = () => {
        if (accordion) setAccordion(false);
        else setAccordion(true);
    };

    function handleInvoiceDownload(week: string) {
        fetch(`${url}/invoice?&week=${week}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
                Accept: 'application/octet-stream',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Failed to download invoice');
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'invoice-' + week + '.pdf';
                a.click();

                // Display success message
                toastService.success(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_SUCCESS'));
            })
            .catch((error) => {
                // Display error message
                toastService.error(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_FAIL'));
            });
    }

    const reverseArray = (arr: any[] | undefined): any[] => {
        if (arr === undefined) return [];
        return [...arr].reverse();
    };

    return (
        <>
            <tr style={{ alignItems: 'center' }}>
                <td style={{ padding: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p
                            style={{
                                fontFamily: 'Lato',
                                marginLeft: '15px',
                                fontSize: '15px',
                            }}
                        >
                            {props.month}
                        </p>
                        {props.revenue !== 0 && props.weeks?.length !== 0 && (
                            <i
                                id="letter"
                                className={`icon icon--sm icon--chevron-right icon--grey mr-3 ${accordion && 'rotate--90'}`}
                                onClick={() => changeAccordion()}
                            ></i>
                        )}
                    </div>
                </td>
                <td>{props.bookingsNum}</td>
                <td>{props.studentsNum}</td>
                <td>{props.reviewsNum}</td>
                <td>
                    {props.revenue}
                    {getCurrencySymbol(countryId)}
                </td>
            </tr>
            {accordion && (
                <>
                    {reverseArray(props.weeks).map((week) => {
                        return (
                            <tr>
                                <td>
                                    <p style={{ fontFamily: 'Lato', marginLeft: '15px' }}>
                                        {t('EARNINGS.PAYOUTS')} {week.name}
                                    </p>
                                </td>
                                <td>{week.bookings}</td>
                                <td>{week.students}</td>
                                <td>{week.reviews}</td>
                                <td>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <p style={{ fontFamily: 'Lato' }}>
                                            {week.revenue}
                                            {getCurrencySymbol(countryId)}
                                        </p>
                                        {props.revenue !== 0 && (
                                            <LiaFileInvoiceDollarSolid
                                                className="completed-booking-pointer primary-color"
                                                size={21}
                                                data-tip="Click to view invoice"
                                                data-tooltip-id="booking-info-tooltip"
                                                data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
                                                onClick={() => handleInvoiceDownload(week.name)}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </>
            )}
        </>
    );
};

export default PayoutsTableElement;
