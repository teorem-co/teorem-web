//add translation later

import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Select, { components, MenuProps } from 'react-select';

import IParams from '../../../interfaces/IParams';
import getUrlParams from '../../utils/getUrlParams';

interface Props {
    className?: string;
    params: IParams;
    updateParams: (updatedParams: IParams) => void;
}
interface CustomAvailabilityValues {
    period: string[];
    dayOfWeek: string[];
}

const CustomMenu = (props: MenuProps) => {
    const history = useHistory();

    const [params, setParams] = useState<IParams>({});
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    const initialValues: CustomAvailabilityValues = {
        period: [],
        dayOfWeek: [],
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            //
        },
    });

    useEffect(() => {
        console.log(formik.values);
    }, [formik.values]);

    useEffect(() => {
        const urlQueries = getUrlParams(
            history.location.search.replace('?', '')
        );

        if (Object.keys(urlQueries).length > 0) {
            setParams(urlQueries);
        }

        setInitialLoad(false);
    }, []);

    useEffect(() => {
        if (!initialLoad) {
            const filterParams = new URLSearchParams();

            if (
                Object.keys(params).length !== 0 &&
                params.constructor === Object
            ) {
                for (const [key, value] of Object.entries(params)) {
                    filterParams.append(key, value);
                }

                history.push({ search: filterParams.toString() });
            }

            //fetch tutors here
        }
    }, [params]);

    const updateParams = (updatedParams: IParams) => {
        setParams(updatedParams);
    };

    // const handleBlur = () => {
    //     const paramsObj = { ...params };

    //     updateParams({ ...paramsObj, dayOfWeek: 'xDDD' });
    // };

    //add id's to checkbox fields
    return (
        <div>
            <components.Menu {...props}>
                <FormikProvider value={formik}>
                    <Form style={{ height: '150px' }}>
                        <div>TIME OF DAY</div>
                        <div role="group" aria-labelledby="checkbox-group">
                            <label>
                                <Field
                                    type="checkbox"
                                    name="period"
                                    value="pre12"
                                />
                                PRE 12 PM
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="period"
                                    value="12-5"
                                />
                                12 - 5 PM
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="period"
                                    value="after5"
                                />
                                AFTER 5 PM
                            </label>
                        </div>
                        <div>DAY OF WEEK</div>
                        <div role="group" aria-labelledby="checkbox-group">
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="mon"
                                />
                                MON
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="tue"
                                />
                                TUE
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="wed"
                                />
                                WED
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="thu"
                                />
                                THU
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="fri "
                                />
                                FRI
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="sat"
                                />
                                SAT
                            </label>
                            <label>
                                <Field
                                    type="checkbox"
                                    name="dayOfWeek"
                                    value="sun"
                                />
                                SUN
                            </label>
                        </div>
                    </Form>
                </FormikProvider>
            </components.Menu>
        </div>
    );
};

const CustomAvailabilitySelect = (props: Props) => {
    const { className, params, updateParams } = props;

    return (
        <Select
            classNamePrefix="tutorSearch"
            className={className}
            placeholder="Custom availability"
            components={{
                Menu: CustomMenu,
            }}
        ></Select>
    );
};

export default CustomAvailabilitySelect;
