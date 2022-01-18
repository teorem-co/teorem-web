import { useState } from 'react';

interface Props {
    checked: boolean;
    //handleRowSelection: (id: string) => void;
    name: string;
}

const CheckboxField = (props: Props) => {
    const { checked, name } = props;
    const [active, setActive] = useState<boolean>(true);

    const handleChange = () => {
        //handleRowSelection(name);
        setActive(!active);
    };

    return (
        <>
            <div className="flex flex--center flex--jc--center">
                <input
                    className={`input input--checkbox`}
                    type="checkbox"
                    id={name}
                    onChange={() => handleChange()}
                    name={name}
                />
                <label htmlFor={name} className={`input--checkbox__label pl-5`}>
                    click
                </label>
            </div>
        </>
    );
};

export default CheckboxField;
