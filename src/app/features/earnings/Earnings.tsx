import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

import MainWrapper from '../../components/MainWrapper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Earnings = () => {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
            },
            title: {
                display: false,
            },
        },
        elements: {
            line: {
                tension: 0.3,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(237,237,237)',
                },
            },
            y: {
                grid: {
                    color: 'rgb(237,237,237)',
                },
            },
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        datasets: [
            {
                parse: false,
                label: 'Dataset 1',
                data: [
                    { x: '2016-12-25', y: 20 },
                    { x: '2016-12-26', y: 25 },
                    { x: '2016-12-27', y: 30 },
                    { x: '2016-12-28', y: 50 },
                ],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <h2 className="type--wgt--bold type--lg">Earnings</h2>
                    <div>dropwdown</div>
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
                        <Line height={200} options={options} data={data} />
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
                            <tr>
                                <td>January</td>
                                <td>18</td>
                                <td>10</td>
                                <td>8</td>
                                <td>$1.123,00</td>
                            </tr>
                            <tr>
                                <td>January</td>
                                <td>18</td>
                                <td>10</td>
                                <td>8</td>
                                <td>$1.123,00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Earnings;
