import {t} from 'i18next';
import React, {useEffect, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";
import toastService from "../../services/toastService";
import {useAppSelector} from "../../hooks";

interface PayoutsProps {
  month: string,
  bookingsNum: number,
  studentsNum: number,
  reviewsNum: number,
  revenue: number,
  weeks?: string[]
}

const fileUrl = 'api/v1/tutors';
const url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_CHAT_FILE_DOWNLOAD_HOST}/${fileUrl}`;

const PayoutsTableElement = (props: PayoutsProps) => {
  const [accordion, setAccordion] = useState(false);
  const userToken = useAppSelector((state) => state.auth.token);
  const [reverseWeeks, setReverseWeeks] = useState();

  const changeAccordion = () => {
    if(accordion) setAccordion(false);
    else setAccordion(true);
  };

  function handleInvoiceDownload(month: string, week: string) {
    fetch(`${url}/invoice?month=${month}&week=${week}`, {
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
        a.download = 'invoice-' + month + "-" + week + '.pdf';
        a.click();

        // Display success message
        toastService.success(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_SUCCESS'));
      })
      .catch(error => {
        // Display error message
        toastService.error(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_FAIL'));
      });
  };

  const reverseArray = (arr: string[] | undefined): string[] => {
    if(arr === undefined) return [];
    return [...arr].reverse();
  };

  return (
    <>
      <tr>
      {props.revenue === 0 ?
        <td style={{padding: "2px"}}>
          <Typography
            style={{fontFamily: "Lato", marginLeft: "15px"}}>{props.month}</Typography>
        </td>
        :
        <td style={{padding: "2px", display: "flex"}}>
            <Typography
              style={{fontFamily: "Lato", marginLeft: "15px"}}>{props.month}</Typography>

            <i
              id="letter"
              className={`icon icon--sm icon--chevron-right icon--grey mr-3 ${accordion && 'rotate--90'}`}
              onClick={() => changeAccordion()}
            ></i>
        </td>
      }
      <td>{props.bookingsNum}</td>
      <td>{props.studentsNum}</td>
      <td>{props.reviewsNum}</td>
      <td>
        {props.revenue}
        {t('EARNINGS.GENERAL.CURRENCY')}
      </td>
      </tr>
      {accordion &&
        <>
          { reverseArray(props.weeks).map((week => {
            return (
              <tr>
                <td style={{width: "19.15%"}}>
                    {t('EARNINGS.PAYOUTS')} {week}
                </td>
                <td>{props.bookingsNum}</td>
                <td>{props.studentsNum}</td>
                <td>{props.reviewsNum}</td>
                <td>
                  {props.revenue}
                  {t('EARNINGS.GENERAL.CURRENCY')}
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

export default PayoutsTableElement;
