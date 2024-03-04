import { useState } from 'react';

interface ICustomCheckbox {
    id: string;
    label: string;
    handleCustomCheck: (id: string) => void;
    customChecks: string[];
}

const CustomCheckbox = (props: ICustomCheckbox) => {
    const { id, label, handleCustomCheck, customChecks } = props;

    const [checked, setChecked] = useState<boolean>(customChecks.find((item: string) => item === id) ? true : false);
    return (
        <div
            className="availability__field"
            onClick={() => {
                setChecked(!checked);
                handleCustomCheck(id);
            }}
        >
            <span className={`availability__checkbox ${checked ? 'checked' : ''}`}></span>
            <span className="availability__label">{label}</span>
        </div>
    );
};

export default CustomCheckbox;
