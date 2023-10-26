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
import Select from 'react-select';

import { OptionType } from '../../components/form/MySelectField';
import MainWrapper from '../../components/MainWrapper';
import { calcYears } from '../../utils/yearOptions';
import earningsGraphOptions from './constants/earningsGraphOptions';
import IGraph from './interfaces/IGraph';
import { useLazyGetEarningsQuery } from './services/earningsService';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {
  useLazyGetCompletedLessonsQuery
} from "../my-bookings/services/completedLessonsService";
interface PayoutsProps {
  month: string,
  bookingsNum: number,
  studentsNum: number,
  reviewsNum: number,
  revenue: number
};

const PayoutsTableElement = (props: PayoutsProps) => {
  return (
    <>
      <td>{props.month}</td>
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
