import {t} from 'i18next';
import React, {useEffect, useState} from 'react';
import toastService from "../../services/toastService";
import {useAppSelector} from "../../hooks";
import {LiaFileInvoiceDollarSolid} from "react-icons/lia";
import IBookingDetails from "./interfaces/IBookingDetails";
import moment from "moment/moment";

interface BookingsProps {
  month: string,
  numOfStudents: number,
  bookings: IBookingDetails[],
  revenue: number,
  teoremCut: number,
  total: number,
}

const fileUrl = 'api/v1/bookings';
const url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_CHAT_FILE_DOWNLOAD_HOST}/${fileUrl}`;

const BookingsTableElement = (props: BookingsProps) => {
  const [accordion, setAccordion] = useState(false);
  const userToken = useAppSelector((state) => state.auth.token);

  const changeAccordion = () => {
    if(accordion) setAccordion(false);
    else setAccordion(true);
  };

  function handleInvoiceDownload(bookingId: string) {
    fetch(`${url}/${bookingId}/invoice`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/octet-stream',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Failed to download invoice');
        }
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice-' + bookingId + '.pdf';
        a.click();

        // Display success message
        toastService.success(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_SUCCESS'));
      })
      .catch(error => {
        // Display error message
        toastService.error(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_FAIL'));
      });
  }

  const reverseArray = (arr: any[] | undefined): any[] => {
    if(arr === undefined) return [];
    return [...arr].reverse();
  };

  return (
    <>
      <tr style={{alignItems: "center"}}>
        <td style={{padding: "2px"}}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              style={{fontFamily: "Lato", marginLeft: "15px", fontSize: "15px"}}>{props.month}</p>
            {props.bookings.length !== 0 &&
              <i
                id="letter"
                className={`icon icon--sm icon--chevron-right icon--grey mr-3 ${accordion && 'rotate--90'}`}
                onClick={() => changeAccordion()}
              ></i>
            }
          </div>
        </td>
        <td>{props.bookings.length}</td>
        <td>{props.numOfStudents}</td>
        <td>{props.revenue}{t('EARNINGS.GENERAL.CURRENCY')}</td>
        <td>{props.teoremCut === 0 ? "" : "-"}{props.teoremCut}{t('EARNINGS.GENERAL.CURRENCY')}</td>
        <td>{props.total}{t('EARNINGS.GENERAL.CURRENCY')}</td>
      </tr>
      {accordion &&
        <>
          { reverseArray(props.bookings).map((booking => {
            return (
              <tr>
                <td>
                  <p
                    style={{fontFamily: "Lato", marginLeft: "15px"}}>{moment(booking.startTime).format(t('DATE_FORMAT') + ' @ HH:mm')}</p>
                </td>
                <td>{t('SUBJECTS.' + booking.subject.name.toLowerCase().replaceAll(" ", ""))}</td>
                <td>{booking.fullName}</td>
                <td>{booking.revenue}{t('EARNINGS.GENERAL.CURRENCY')}</td>
                <td>-{booking.teoremCut}{t('EARNINGS.GENERAL.CURRENCY')}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p
                      style={{fontFamily: "Lato"}}>{booking.total}
                      {t('EARNINGS.GENERAL.CURRENCY')}</p>
                    {props.revenue !== 0 &&
                      <LiaFileInvoiceDollarSolid
                        className='completed-booking-pointer primary-color'
                        size={21}
                        data-tip='Click to view invoice'
                        data-tooltip-id='booking-info-tooltip'
                        data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
                        onClick={() => handleInvoiceDownload(booking.id)}
                      /> }
                  </div>
                </td>
              </tr>
            );
          }))
          }
        </>
      }
    </>
  );
};

export default BookingsTableElement;
