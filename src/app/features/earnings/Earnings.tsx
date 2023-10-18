import {
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
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import MainWrapper from '../../components/MainWrapper';
import { calcYears } from '../../utils/yearOptions';
import earningsGraphOptions from './constants/earningsGraphOptions';
import IGraph from './interfaces/IGraph';
import { useLazyGetEarningsQuery } from './services/earningsService';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Earnings = () => {
  const [getEarnings, { data: earningsData }] = useLazyGetEarningsQuery();
  //calculate years to select
  const yearOptions = calcYears();

  const [earningsGraphData, setEarningsGraphData] = useState<IGraph[]>([]);
  const [studentsGraphData, setStudentsGraphData] = useState<IGraph[]>([]);
  const [bookingsGraphData, setBookingsGraphData] = useState<IGraph[]>([]);

  const data = {
    datasets: [
      {
        parse: false,
        label: t('EARNINGS.REVENUE.GRAPH_LEGEND'),
        data: earningsGraphData,
        fill: true,
        backgroundColor: 'rgba(162, 108, 242, 0.04)',
        borderColor: 'rgb(162, 108, 242)',
        borderWidth: 1,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        parse: false,
        label: t('EARNINGS.STUDENTS.GRAPH_LEGEND'),
        data: studentsGraphData,
        fill: true,
        backgroundColor: 'rgba(162, 108, 242, 0.04)',
        borderColor: 'rgb(27, 131, 251)',
        borderWidth: 1,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        parse: false,
        label: t('EARNINGS.BOOKINGS.GRAPH_LEGEND'),
        data: bookingsGraphData,
        fill: true,
        backgroundColor: 'rgba(162, 108, 242, 0.04)',
        borderColor: 'rgb(11, 138, 0)',
        borderWidth: 1,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const fetchData = async (date: string) => {
    const response = await getEarnings("YEAR").unwrap();
    setEarningsGraphData(response.earnings_graph);
    setBookingsGraphData(response.bookings_graph);
    setStudentsGraphData(response.students_graph);
  };

  const [alignment, setAlignment] = React.useState('year');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    const selectedDateIso = moment(new Date()).toISOString();
    fetchData(selectedDateIso);
  }, []);

  const weekDetails = async () => {
    const response = await getEarnings("WEEK").unwrap();
    setEarningsGraphData(response.earnings_graph);
    setBookingsGraphData(response.bookings_graph);
    setStudentsGraphData(response.students_graph);
  };

  const monthDetails = async () => {
    const response = await getEarnings("MONTH").unwrap();
    setEarningsGraphData(response.earnings_graph);
    setBookingsGraphData(response.bookings_graph);
    setStudentsGraphData(response.students_graph);
  };

  const yearDetails = async () => {
    const response = await getEarnings("YEAR").unwrap();
    setEarningsGraphData(response.earnings_graph);
    setBookingsGraphData(response.bookings_graph);
    setStudentsGraphData(response.students_graph);
  };

  const allTimeDetails = async () => {
    const response = await getEarnings("ALLTIME").unwrap();
    setEarningsGraphData(response.earnings_graph);
    setBookingsGraphData(response.bookings_graph);
    setStudentsGraphData(response.students_graph);
  };

  return (
    <MainWrapper>
      <div className="card--secondary">
        <div className="card--secondary__head">
          <h2 className="type--wgt--bold type--lg">{t('EARNINGS.TITLE')}</h2>
        </div>
        <div className="card--secondary__body">
          <div className="card--secondary__head">
          <div className="type--color--tertiary type--spacing mb-2">{t('EARNINGS.GENERAL.TITLE')}</div>
          <ToggleButtonGroup
            color="info"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="week" onClick={() => weekDetails()}>Week</ToggleButton>
            <ToggleButton value="month" onClick={() => monthDetails()}>Month</ToggleButton>
            <ToggleButton value="year" onClick={() => yearDetails()}>Year</ToggleButton>
            <ToggleButton value="all-time" onClick={() => allTimeDetails()}>All time</ToggleButton>
          </ToggleButtonGroup>
          </div>
          <div className="row">
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div className="card--earnings__title">{earningsData?.totalBookings}</div>
                <div>{t('EARNINGS.GENERAL.BOOKINGS')}</div>
                <i className="icon icon--subject cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div className="card--earnings__title">{earningsData?.totalStudents}</div>
                <div>{t('EARNINGS.GENERAL.STUDENTS')}</div>
                <i className="icon icon--tutor cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div className="card--earnings__title">{earningsData?.totalReviews}</div>
                <div>{t('EARNINGS.GENERAL.REVIEWS')}</div>
                <i className="icon icon--reviews cur--default"></i>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-xl-3">
              <div className="card--earnings">
                <div className="card--earnings__title">{earningsData?.totalEarnings}.00 €</div>
                <div>{t('EARNINGS.GENERAL.REVENUE')}</div>
                <i className="icon icon--level cur--default"></i>
              </div>
            </div>
          </div>
          <div>
            <Line height={200} options={earningsGraphOptions} data={data} />
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
