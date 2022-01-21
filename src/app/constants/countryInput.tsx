import { components } from 'react-select';

export const countryInput = (props: any) => {
    if (props.data.icon) {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="input-select__icon mr-2">
                        {props.data.icon}
                    </span> */}
                    <div className="flex--col flex flex--center">
                        <div
                            style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: 'blue',
                            }}
                            className="mr-2"
                        ></div>
                        <div
                            style={{
                                width: '20px',
                                height: '10px',
                                backgroundColor: 'redlue',
                            }}
                            className="mr-2"
                        ></div>
                    </div>
                    <span>{props.data.label}</span>
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
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        );
    }
};
