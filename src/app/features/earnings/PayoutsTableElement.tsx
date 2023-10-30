import {t} from 'i18next';
import React, {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@mui/material";

interface PayoutsProps {
  month: string,
  bookingsNum: number,
  studentsNum: number,
  reviewsNum: number,
  revenue: number
}

const PayoutsTableElement = (props: PayoutsProps) => {
  const [accordion, setAccordion] = useState(false);

  const changeAccordion = () => {
    if(accordion) setAccordion(false);
    else setAccordion(true);
  };

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
            </div>
          </AccordionSummary>
          <AccordionDetails style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>
            <Typography style={{fontFamily: "Lato"}}>
              <div style={{display: "flex", alignItems: "center"}}>
                {props.month}
                <i className="icon icon--base icon--download icon--primary"></i>
              </div>
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
