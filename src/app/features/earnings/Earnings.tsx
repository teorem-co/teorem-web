import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Select, { components } from 'react-select';

import MySelect from '../../components/form/MySelectField';
import MainWrapper from '../../components/MainWrapper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Earnings = () => {
    const xAxisLabels = [
        'Jan',
        'Jan_2',
        'Feb',
        'Feb_2',
        'Mar',
        'Mar_2',
        'Apr',
        'Apr_2',
        'May',
        'May_2',
        'Jun',
        'Jun_2',
        'Jul',
        'Jul_2',
        'Aug',
        'Aug_2',
        'Sep',
        'Sep_2',
        'Oct',
        'Oct_2',
        'Nov',
        'Nov_2',
        'Dec',
        'Dec_2',
    ];
    const options = {
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
        elements: {
            line: {
                tension: 0.3,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(240,240,240)',
                    borderColor: 'rgb(240,240,240)',
                    drawTicks: true,
                    tickColor: 'transparent',
                    tickLength: 16,
                },
                ticks: {
                    callback: (item: string | number, index: number) => {
                        if (!(index % 2)) {
                            return xAxisLabels[index];
                        }
                    },
                    autoSkip: false,
                },
            },
            y: {
                grid: {
                    color: 'rgb(240,240,240)',
                    borderColor: 'rgb(240,240,240)',
                    drawTicks: true,
                    tickColor: 'transparent',
                    tickLength: 16,
                },
                ticks: {
                    maxTicksLimit: 5,
                },
            },
        },
    };

    const data = {
        datasets: [
            {
                parse: false,
                label: 'Income',
                data: [
                    { x: 'Jan', y: 20 },
                    { x: 'Jan_2', y: 25 },
                    { x: 'Feb', y: 30 },
                    { x: 'Feb_2', y: 50 },
                    { x: 'Mar', y: 60 },
                    { x: 'Mar_2', y: 10 },
                    { x: 'Apr', y: 80 },
                    { x: 'Apr_2', y: 40 },
                    { x: 'May', y: 30 },
                    { x: 'May_2', y: 25 },
                    { x: 'Jun', y: 35 },
                    { x: 'Jun_2', y: 40 },
                ],
                fill: true,
                backgroundColor: 'rgba(162, 108, 242, 0.04)',
                borderColor: 'rgb(162, 108, 242)',
                borderWidth: 1,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const selectOptions = [
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' },
    ];

    const onChange = () => {
        console.log('povuci nove podatke');
    };

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <h2 className="type--wgt--bold type--lg">Earnings</h2>
                    <div>
                        <Select
                            classNamePrefix="react-select"
                            defaultValue={selectOptions[selectOptions.length - 1]}
                            onChange={onChange}
                            options={selectOptions}
                        />
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
