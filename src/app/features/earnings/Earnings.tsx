import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';

import { OptionType } from '../../components/form/MySelectField';
import MainWrapper from '../../components/MainWrapper';
import { calcYears } from '../../utils/yearOptions';
import earningsGraphOptions from './constants/earningsGraphOptions';
import IGraph from './interfaces/IGraph';
import { useLazyGetEarningsQuery } from './services/earningsService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Earnings = () => {
    const [getEarnings, { data: earningsData }] = useLazyGetEarningsQuery();
    //calculate years to select
    const yearOptions = calcYears();

    const [earningsGraphData, setEarningsGraphData] = useState<IGraph[]>([]);
    const [selectedYear, setSelectedYear] = useState<OptionType>(yearOptions[yearOptions.length - 1]);

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
        ],
    };

    const onChange = (e: OptionType | null) => {
        if (e) setSelectedYear(e);
    };

    const fetchData = async (date: string) => {
        const response = await getEarnings(date).unwrap();
        setEarningsGraphData(response.graph);
    };

    useEffect(() => {
        const selectedDate = '06.01.' + selectedYear.value + '.';
        const selectedDateIso = moment(selectedDate).toISOString();
        fetchData(selectedDateIso);
    }, [selectedYear]);

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <h2 className="type--wgt--bold type--lg">{t('EARNINGS.TITLE')}</h2>
                    <div>
                        <Select classNamePrefix="earnings-select" defaultValue={selectedYear} onChange={(e) => onChange(e)} options={yearOptions} />
                    </div>
                </div>
                <div className="card--secondary__body">
                    <div className="type--color--tertiary type--spacing mb-2">{t('EARNINGS.GENERAL.TITLE')}</div>
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
                                <div className="card--earnings__title">{earningsData?.totalEarnings}.00</div>
                                <div>{t('EARNINGS.GENERAL.REVENUE')}</div>
                                <i className="icon icon--level cur--default"></i>
                            </div>
                        </div>
                    </div>
                    <div className="type--color--tertiary  type--spacing mt-10 mb-2">{t('EARNINGS.REVENUE.TITLE')}</div>
                    <div>
                        <Line height={200} options={earningsGraphOptions} data={data} />
                    </div>
                    <div className="type--color--tertiary  type--spacing mt-10 mb-2">{t('EARNINGS.DETAILS.TITLE')}</div>
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
                                            <td>{tableItem.month}</td>
                                            <td>{tableItem.bookings}</td>
                                            <td>{tableItem.students}</td>
                                            <td>{tableItem.reviews}</td>
                                            <td>${tableItem.revenue}</td>
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
