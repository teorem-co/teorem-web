import { components } from 'react-select';

export const countryInput = (props: any) => {
    if (props.data.icon) {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="input-select__icon mr-2">
                        {props.data.icon}
                    </span> */}
                    <div className="mr-2 flex">
                        {props.data.icon ? (
                            <img
                                className="react-select__flag"
                                src={props.data.icon}
                                alt="country flag"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        );
    } else {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <div
                    style={{
                        width: '20px',
                        height: '10px',
                        backgroundColor: 'blue',
                    }}
                    className="mr-2"
                ></div> */}
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        );
    }
};
