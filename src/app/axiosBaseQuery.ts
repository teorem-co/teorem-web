import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getToken } from './utils/getToken';

export const axiosBaseQuery = ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }):
    BaseQueryFn<
        {
            url: string,
            method: AxiosRequestConfig['method'],
            data?: AxiosRequestConfig['data'],
            headers?: AxiosRequestConfig['headers']
        },
        unknown,
        unknown
    > => async ({ url, method, data }) => {
        let headers = null;
        const token = getToken();

        if (token) {
            headers = { 'authorization': `Bearer ${token}` };
        }
        try {
            const axiosConfig = {
                url: baseUrl + url,
                method,
                data
            };
            const axiosConfigAuth = {
                ...axiosConfig,
                headers
            };
            const result = await axios(headers ? axiosConfigAuth : axiosConfig);
            return { data: result.data }
        } catch (axiosError) {
            let err = axiosError as AxiosError
            return {
                error: { status: err.response?.status, data: err.response?.data }
            }
        }
    };