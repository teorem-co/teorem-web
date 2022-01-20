import { components } from 'react-select';

export const phoneNumberInput = (props: any) => {
    if (props.data.icon) {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--center">
                    <div
                        style={{
                            width: '20px',
                            height: '10px',
                            backgroundColor: 'blue',
                        }}
                        className="mr-2"
                    ></div>
                    <span>{props.data.phonePrefix}</span>
                </div>
            </components.SingleValue>
        );
    } else {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--center">
                    <div
                        style={{
                            width: '20px',
                            height: '10px',
                            backgroundColor: 'blue',
                        }}
                        className="mr-2"
                    ></div>
                    <span>{props.data.phonePrefix}</span>
                </div>
            </components.SingleValue>
        );
    }
};
