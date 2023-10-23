import {
  BarElement,
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
import {t} from 'i18next';
import React, {useEffect, useState} from 'react';
import MainWrapper from '../../components/MainWrapper';
import {useLazyGetEarningsQuery} from './services/earningsService';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Chart} from "react-chartjs-2";
import IGraph from "./interfaces/IGraph";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Earnings = () => {
  const [getEarnings, {data: earningsData}] = useLazyGetEarningsQuery();

  const [labels, setLabels] = useState<string[]>([]);
  const [maxNumOfTicks, setMaxNumOfTicks] = useState(0);
  const [periodOfTime, setPeriodOfTime] = useState("YEAR");

  const fetchData = async () => {
    const response = await getEarnings(periodOfTime).unwrap();
    setLabels(response.labels);
    const maxNum = Math.max(response.totalStudents, response.totalBookings) + 2;
    setMaxNumOfTicks(maxNum);
  };

  const [alignment, setAlignment] = React.useState('year');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    fetchData();
  }, [periodOfTime]);

  return (
    <MainWrapper>
      <div className="card--secondary">
        <div className="card--secondary__head">
          <h2 className="type--wgt--bold type--lg">{t('EARNINGS.TITLE')}</h2>
        </div>
        <div className="card--secondary__body">
          <div className="card--secondary__head">
            <div
              className="type--color--tertiary type--spacing mb-2">{t('EARNINGS.GENERAL.TITLE')}</div>
            <ToggleButtonGroup
              color="info"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="week"
                            onClick={() => setPeriodOfTime("WEEK")}>Week</ToggleButton>
              <ToggleButton value="month"
                            onClick={() => setPeriodOfTime("MONTH")}>Month</ToggleButton>
              <ToggleButton value="year"
                            onClick={() => setPeriodOfTime("YEAR")}>Year</ToggleButton>
              <ToggleButton value="all-time"
                            onClick={() => setPeriodOfTime("ALLTIME")}>All
                time</ToggleButton>
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
          <div>
            {earningsData && earningsData.earnings_graph && (
              <div>
                <Chart type={"bar"}
                       data={
                         {
                           labels,
                           datasets: [
                             {
                               type: 'line' as const,
                               label: 'Students',
                               backgroundColor: 'rgb(27,131,251)',
                               data: earningsData?.students_graph
                                 .map(item => item.y),
                               yAxisID: "y1",
                             },
                             {
                               type: 'line' as const,
                               label: 'Bookings',
                               backgroundColor: 'rgb(11,138,0)',
                               data: earningsData?.bookings_graph
                                 .map(item => item.y),
                               yAxisID: "y1",
                             },
                             {
                               type: 'bar' as const,
                               label: 'Earnings',
                               backgroundColor: 'rgb(126,108,242)',
                               data: earningsData.earnings_graph
                                 .map((item: IGraph) => item.y),
                               yAxisID: "y",
                               barPercentage: 1.0,
                             },
                           ],
                         }
                       } options={{
                         maintainAspectRatio: false,
                  responsive: true,
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
                  scales: {
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      beginAtZero: true,
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
                  },
                }}/>
              </div>
            )}
          </div>
          <div className="card--secondary__head">
              <div className="type--color--tertiary  type--spacing mt-10 mb-2">{t('EARNINGS.DETAILS.TITLE')}</div>
            </div>
            <table className="table table--secondary">
              <thead>
              <tr>
                <th>{t('EARNINGS.DETAILS.TABLE.MONTH')}</th>
                <th>{t('EARNINGS.DETAILS.TABLE.BOOKINGS')}</th>
                <th>{t('EARNINGS.DETAILS.TABLE.STUDENTS')}</th>
                <th>{t('EARNINGS.DETAILS.TABLE.REVIEWS')}</th>
                <th>{t('EARNINGS.DETAILS.TABLE.REVENUE')}</th>
              </tr>
              </thead>
              <tbody>
              {(earningsData &&
                  earningsData.details.map((tableItem) => {
                    return (
                      <tr>
                        <td>{t('CONSTANTS.MONTHS_LONG.' + tableItem.month.substring(0, 3).toUpperCase())}</td>
                        <td>{tableItem.bookings}</td>
                        <td>{tableItem.students}</td>
                        <td>{tableItem.reviews}</td>
                        <td>
                          {tableItem.revenue}
                          {t('EARNINGS.GENERAL.CURRENCY')}
                        </td>
                      </tr>
                    );
                  })) ||
                t('EARNINGS.DETAILS.TABLE.EMPTY')}
              </tbody>
            </table>
          </div>
        </div>
    </MainWrapper>
  );
};

export default Earnings;
