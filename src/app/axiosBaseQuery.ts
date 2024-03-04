import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import parseIsoDate from 'yup/es/util/isodate';

export const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' }
    ): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            headers?: AxiosRequestConfig['headers'];
        },
        unknown,
        unknown
    > =>
    async ({ url, method, data }) => {
        let headers = null;
        const token = null;

        if (token) {
            headers = { authorization: `Bearer ${token}` };
        }
        try {
            const axiosConfig = {
                url: baseUrl + url,
                method,
                data,
            };
            const axiosConfigAuth = {
                ...axiosConfig,
                headers,
            };
            const result = await axios(headers ? axiosConfigAuth : axiosConfig);

            result.data.interceptors.response.use((originalResponse: { data: any }) => {
                handleDates(originalResponse.data);
                return originalResponse;
            });

            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data,
                },
            };
        }
    };

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
    return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object') return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = parseIsoDate(value);
        else if (typeof value === 'object') handleDates(value);
    }
}
