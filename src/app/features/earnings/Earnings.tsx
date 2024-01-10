import {
  BarElement,
  BarController,
  LineController,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import {Chart, Line} from 'react-chartjs-2';

import MainWrapper from '../../components/MainWrapper';
import {
  useLazyGetBookingInvoicesQuery,
  useLazyGetEarningsQuery,
  useLazyGetPayoutsQuery
} from './services/earningsService';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import PayoutsTableElement from "./PayoutsTableElement";
import IGraph from "./interfaces/IGraph";
import {LiaFileInvoiceDollarSolid} from "react-icons/lia";
import toastService from "../../services/toastService";
import {useAppSelector} from "../../hooks";
import BookingsTableElement from "./BookingsTableElement";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, BarElement, BarController, Title, Tooltip, Legend, Filler);

const fileUrl = 'api/v1/tutors';
const url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_CHAT_FILE_DOWNLOAD_HOST}/${fileUrl}`;

const Earnings = () => {
  const [getEarnings, { data: earningsData }] = useLazyGetEarningsQuery();
  const [getPayouts, {data: payoutsData}] = useLazyGetPayoutsQuery();
  const userToken = useAppSelector((state) => state.auth.token);
  const [getBookings, {data: bookingsData}] = useLazyGetBookingInvoicesQuery();

  const [table, setTable] = useState("PAYOUTS");
  const [labels, setLabels] = useState<string[]>([]);
  const [maxNumOfTicks, setMaxNumOfTicks] = useState(0);
  const [periodOfTime, setPeriodOfTime] = useState("MONTH");

  const ordinalNumber = (numInString: string): string => {
    let num:number = +numInString;
    num = Math.round(num);
    const numString = num.toString();

    if(t('EARNINGS.WEEK') !== "Last 7 days") {
      return numString + ".";
    }

    if (Math.floor(num / 10) % 10 === 1) {
      return numString + "th";
    }

    switch (num % 10) {
      case 1: return numString + "st";
      case 2: return numString + "nd";
      case 3: return numString + "rd";
      default: return numString + "th";
    }
  };

  const fetchData = async () => {
    const response = await getEarnings(periodOfTime).unwrap();
    const payoutsResponse = await getPayouts().unwrap();
    const bookingsResponse = await getBookings().unwrap();
    if(periodOfTime === "YEAR") {
      setLabels(response.labels.map((item) => t('CONSTANTS.MONTHS_LONG.' + item.substring(0, 3).toUpperCase())));
    } else if (periodOfTime === "WEEK") {
      setLabels(response.labels.map((item) => t('CONSTANTS.DAYS_LONG.' + item.substring(0, 3).toUpperCase())));
    } else if(periodOfTime == "MONTH"){
      setLabels(response.labels.map(item => ordinalNumber(item)));
    } else {
      setLabels(response.labels);
    }
    const maxNum = Math.max(response.totalStudents, response.totalBookings) + 2;
    setMaxNumOfTicks(maxNum);
  };

  const [alignment, setAlignment] = React.useState('month');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    fetchData();
  }, [periodOfTime]);

  function handleInvoiceDownload() {
    fetch(`${url}/all-invoices`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/octet-stream',
      },
    })
      .then(response => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition?.split('=')[1].replace(/['"]/g, '').trim();
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName + '';
          a.click();
        });
      })
      .catch(error => {
        // Display error message
        toastService.error(t('COMPLETED_LESSONS.DOWNLOAD_INVOICE_FAIL'));
      });
  };

  return (
    <MainWrapper>
      <div className="card--secondary">
        <div className="card--secondary__head">
          <h2 className="type--wgt--bold type--lg">{t('EARNINGS.TITLE')}</h2>
        </div>
        <div className="card--secondary__body" style={{marginTop: "-35px"}}>
          <div className="card--secondary__head">
            <div className="type--color--tertiary type--spacing mb-2">{t('EARNINGS.GENERAL.TITLE')}</div>
            <ToggleButtonGroup
              color="info"
              value={alignment}
              exclusive
              size="small"
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="week"
                            onClick={() => setPeriodOfTime("WEEK")}
                            style={{fontSize: "11px"}}
              >{t('EARNINGS.WEEK')}</ToggleButton>
              <ToggleButton value="month"
                            onClick={() => setPeriodOfTime("MONTH")}
                            style={{fontSize: "11px"}}
              >{t('EARNINGS.MONTH')}</ToggleButton>
              <ToggleButton value="year"
                            onClick={() => setPeriodOfTime("YEAR")}
                            style={{fontSize: "11px"}}
              >{t('EARNINGS.YEAR')}</ToggleButton>
              <ToggleButton value="all-time"
                            onClick={() => setPeriodOfTime("ALLTIME")}
                            style={{fontSize: "11px"}}
              >{t('EARNINGS.ALLTIME')}</ToggleButton>
            </ToggleButtonGroup>
          </div>
            <div className="row">
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div
                  className="card--earnings__title">{earningsData?.totalBookings}</div>
                <div>{t('EARNINGS.GENERAL.BOOKINGS')}</div>
                <i className="icon icon--subject cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div
                  className="card--earnings__title">{earningsData?.totalStudents}</div>
                <div>{t('EARNINGS.GENERAL.STUDENTS')}</div>
                <i className="icon icon--tutor cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div
                  className="card--earnings__title">{earningsData?.totalReviews}</div>
                <div>{t('EARNINGS.GENERAL.REVIEWS')}</div>
                <i className="icon icon--reviews cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div
                  className="card--earnings__title">{earningsData?.totalEarnings}.00
                  €
                </div>
                <div>{t('EARNINGS.GENERAL.REVENUE')}</div>
                <i className="icon icon--level cur--default"></i>
              </div>
            </div>
            </div>
          <br/>
          <div>
            {earningsData && earningsData.earningsGraph && (
              <div>
                <Chart type={"bar"}
                       data={
                         {
                           labels,
                           datasets: [
                             {
                               type: 'bar' as const,
                               label: t('EARNINGS.STUDENTS.GRAPH_LEGEND'),
                               backgroundColor: 'rgb(75,0,130)',
                               data: earningsData?.studentsGraph
                                 .map(item => item.y),
                               yAxisID: "y1",
                             },
                             {
                               type: 'bar' as const,
                               label: t('EARNINGS.BOOKINGS.GRAPH_LEGEND'),
                               backgroundColor: 'rgb(203, 195, 251)',
                               data: earningsData?.bookingsGraph
                                 .map(item => item.y),
                               yAxisID: "y1",
                             },
                             {
                               type: 'line' as const,
                               label: t('EARNINGS.REVENUE.GRAPH_LEGEND'),
                               data: earningsData.earningsGraph
                                 .map((item: IGraph) => item.y),
                               yAxisID: "y",
                               fill: true,
                               backgroundColor: 'rgba(162, 108, 242, 0.04)',
                               borderColor: 'rgb(162, 108, 242)',
                               borderWidth: 1,
                               pointBackgroundColor: '#fff',
                               pointBorderWidth: 2,
                             },
                           ],
                         }
                       } options={{
                         aspectRatio: 1|3,
                  responsive: true,
                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      align: 'end' as const,
                      labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    title: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.3,
                    },
                    point: {
                      radius: 0,
                      hoverRadius: 4,
                      hitRadius: 8,
                    },
                  },
                  scales: {
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      beginAtZero: true,
                      title: {
                        text: t('EARNINGS.REVENUE.GRAPH_LEGEND') + ' / EUR',
                        display: true,
                      },
                      grid: {
                        drawOnChartArea: false,
                      }
                    },
                    y1: {
                      min: 0,
                      max: maxNumOfTicks,
                      beginAtZero: true,
                      type: 'linear' as const,
                      display: true,
                      position: 'right' as const,
                      ticks: {
                        stepSize: 1,
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                }}/>
              </div>
            )}
          </div>
          <div className="card--secondary__head">
            <div className="type--color--tertiary type--spacing mb-2">{t('EARNINGS.DETAILS.TITLE')}</div>
            <ToggleButtonGroup
              color="info"
              value={alignment}
              exclusive
              size="small"
              onChange={handleChange}
              aria-label="Platform"
            >
              {table==="PAYOUTS" && payoutsData?.hasInvoices ?
                <LiaFileInvoiceDollarSolid
                  className='completed-booking-pointer primary-color'
                  size={25}
                  data-tip='Click to view invoice'
                  data-tooltip-id='booking-info-tooltip'
                  style={{marginRight: "10px", marginTop: "5px"}}
                  data-tooltip-html={t('COMPLETED_LESSONS.TOOLTIP_DOWNLOAD_INVOICE')}
                  onClick={() => handleInvoiceDownload()}
                />: null}
              <ToggleButton value="payouts"
                            onClick={() => setTable("PAYOUTS")}
                            style={{fontSize: "11px"}}
              >Payouts</ToggleButton>
              <ToggleButton value="bookings"
                            onClick={() => setTable("BOOKINGS")}
                            style={{fontSize: "11px"}}
              >Bookings</ToggleButton>
            </ToggleButtonGroup>
          </div>
            {
              table == "PAYOUTS" ? (
                <table className="table table--secondary" style={{tableLayout: "fixed"}}>
                  <thead>
                  <tr>
                    <th>{t('EARNINGS.DETAILS.TABLE.MONTH')}</th>
                    <th style={{width: "300px"}}>{t('EARNINGS.DETAILS.TABLE.BOOKINGS')}</th>
                    <th style={{width: "300px"}}>{t('EARNINGS.DETAILS.TABLE.STUDENTS')}</th>
                    <th style={{width: "300px"}}>{t('EARNINGS.DETAILS.TABLE.REVIEWS')}</th>
                    <th style={{width: "300px"}}>{t('EARNINGS.DETAILS.TABLE.REVENUE')}</th>
                  </tr>
                  </thead>
                <tbody>
                {(payoutsData &&
                    payoutsData.details.map((tableItem) => {
                      return (
                        <PayoutsTableElement
                          month={t('CONSTANTS.MONTHS_LONG.' + tableItem.period.substring(0, 3).toUpperCase())}
                          bookingsNum={tableItem.bookings}
                          studentsNum={tableItem.students}
                          reviewsNum={tableItem.reviews}
                          revenue={tableItem.revenue}
                          weeks={tableItem.weeks}
                        />
                      );
                    })) ||
                  t('EARNINGS.DETAILS.TABLE.EMPTY')}
                </tbody>
                </table>
              ) :
                <table className="table table--secondary" style={{tableLayout: "fixed"}}>
                  <thead>
                  <tr>
                    <th>{t('EARNINGS.DETAILS.TABLE.MONTH')}</th>
                    <th style={{width: "240px"}}>{t('EARNINGS.DETAILS.TABLE.BOOKINGS')}</th>
                    <th style={{width: "240px"}}>{t('EARNINGS.DETAILS.TABLE.STUDENTS')}</th>
                    <th style={{width: "240px"}}>{t('EARNINGS.DETAILS.TABLE.REVENUE')}</th>
                    <th style={{width: "240px"}}>{t('EARNINGS.DETAILS.TABLE.PROVISION')}</th>
                    <th style={{width: "240px"}}>{t('EARNINGS.DETAILS.TABLE.PAYOUT')}</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(bookingsData &&
                      bookingsData.invoicesForMonth.map((tableItem) => {
                        return (
                          <BookingsTableElement
                            month={t('CONSTANTS.MONTHS_LONG.' + tableItem.month.substring(0, 3).toUpperCase())}
                            numOfStudents={tableItem.numOfStudents}
                            bookings={tableItem.bookings}
                            revenue={tableItem.revenue}
                            teoremCut={tableItem.teoremCut}
                            total={tableItem.total}
                          />
                        );
                      })) ||
                    t('EARNINGS.DETAILS.TABLE.EMPTY')}
                  </tbody>
                </table>
            }
          </div>
        </div>
    </MainWrapper>
  );
};

export default Earnings;
