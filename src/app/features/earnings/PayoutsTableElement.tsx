import {t} from 'i18next';
import React, {useState} from 'react';
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
  }

  return (
    <>
      <td>
        <Accordion style={{
          border: 'none',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          width: 'fit-content'
        }}>
          <AccordionSummary>
            <div style={{display: "flex", alignItems: "center"}} onClick={() => changeAccordion()}>
              <i
                id="letter"
                className={`icon icon--sm icon--chevron-right icon--grey mr-3 ${accordion && 'rotate--90'}`}
              ></i>
              <Typography
                style={{fontFamily: "Lato"}}>{props.month}</Typography>
                <i className="icon icon--base icon--download icon--primary"></i>
            </div>
          </AccordionSummary>
          <AccordionDetails style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>
            <Typography style={{fontFamily: "Lato"}}>
              { props.weeks?.map((week => {
                  return (
                    <div style={{display: "flex", alignItems: "center"}}>
                      {t('EARNINGS.WEEK_TITLE')} {week}
                      <br/>
                      <i className="icon icon--base icon--download icon--primary" onClick={() => handleInvoiceDownload(props.month, week)}></i>
                    </div>
                  );
                }))
              }
            </Typography>
          </AccordionDetails>
        </Accordion>
      </td>
      <td>{props.bookingsNum}</td>
      <td>{props.studentsNum}</td>
      <td>{props.reviewsNum}</td>
      <td>
        {props.revenue}
        {t('EARNINGS.GENERAL.CURRENCY')}
      </td>
    </>
  );
};

export default PayoutsTableElement;
