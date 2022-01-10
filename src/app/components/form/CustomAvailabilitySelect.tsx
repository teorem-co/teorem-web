import { Field, FieldProps, Formik, useField } from 'formik';
import React, { ComponentType } from 'react';
import Select, { components } from 'react-select';
import Menu, {
    MenuListProps,
} from 'react-select/dist/declarations/src/components/Menu';

import { OptionType } from '../MySelectField';

//add translation later

const customAvailabilityMenu = (props: MenuListProps) => {
    const { selectProps } = props;
    return (
        <div>
            <div>
                <div>TIME OF DAY</div>
                {/* <Select closeMenuOnSelect={false} value={values}></Select> */}
                <form>
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                </form>
            </div>
            <div>
                <div>DAY OF WEEK</div>
                {/* <Select></Select> */}
            </div>
        </div>
    );
};

const options = [
    {
        value: 'Monday',
        label: 'Monday',
    },
    {
        value: 'Friday',
        label: 'Friday',
    },
];

//on blur will send values to parent component
const CustomAvailabilitySelect = () => {
    return (
        <Select
            placeholder="Custom availability"
            components={{
                MenuList: customAvailabilityMenu,
            }}
            onChange={(newValue) => {
                console.log(newValue);
            }}
            options={options}
            isMulti={true}
            closeMenuOnSelect={false}
            onBlur={() => {
                console.log('ON BLUR!');
            }}
        ></Select>
    );
};

export default CustomAvailabilitySelect;
