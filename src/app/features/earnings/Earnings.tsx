import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';

import { OptionType } from '../../components/form/MySelectField';
import MainWrapper from '../../components/MainWrapper';
import { calcYears } from '../../utils/yearOptions';
import earningsGraphOptions from './constants/earningsGraphOptions';
import tableData from './constants/tableData';
import IGraph from './interfaces/IGraph';
import { useLazyGetEarningsQuery } from './services/earningsService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Earnings = () => {
    const [getEarnings] = useLazyGetEarningsQuery();
    //calculate years to select
    const yearOptions = calcYears();

    const [earningsGraphData, setEarningsGraphData] = useState<IGraph[]>([]);
    const [selectedYear, setSelectedYear] = useState<OptionType>(yearOptions[yearOptions.length - 1]);

    const data = {
        datasets: [
            {
                parse: false,
                label: 'Income',
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
                    <h2 className="type--wgt--bold type--lg">Earnings</h2>
                    <div>
                        <Select classNamePrefix="react-select" defaultValue={selectedYear} onChange={(e) => onChange(e)} options={yearOptions} />
                    </div>
                </div>
                <div className="card--secondary__body">
                    <div className="upcoming-lessons__title">GENERAL INFORMATION</div>
                    <div className="row">
                        <div className="col col-12 col-md-6 col-xl-3">
                            <div className="card--dashboard">
                                <div className="card--dashboard__title">156</div>
                                <div>Total bookings</div>
                                <i className="icon icon--subject"></i>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-xl-3">
                            <div className="card--dashboard">
                                <div className="card--dashboard__title">80</div>
                                <div>Total students</div>
                                <i className="icon icon--tutor"></i>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-xl-3">
                            <div className="card--dashboard">
                                <div className="card--dashboard__title">95</div>
                                <div>Total reviews</div>
                                <i className="icon icon--reviews"></i>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-xl-3">
                            <div className="card--dashboard">
                                <div className="card--dashboard__title">15.748,00</div>
                                <div>Total revenue</div>
                                <i className="icon icon--level"></i>
                            </div>
                        </div>
                    </div>
                    <div className="upcoming-lessons__title mt-10">REVENUE</div>
                    <div>
                        <Line height={200} options={earningsGraphOptions} data={data} />
                    </div>
                    <div className="upcoming-lessons__title mt-10">DETAILS</div>
                    <table className="table table--secondary">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Bookings</th>
                                <th>Students</th>
                                <th>Reviews</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((tableItem) => {
                                return (
                                    <tr>
                                        <td>{tableItem.month}</td>
                                        <td>{tableItem.bookings}</td>
                                        <td>{tableItem.students}</td>
                                        <td>{tableItem.reviews}</td>
                                        <td>${tableItem.revenue}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Earnings;
