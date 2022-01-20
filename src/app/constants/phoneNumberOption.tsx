import { components } from 'react-select';

export const phoneNumberOption = (props: any) => {
    const { innerProps } = props;
    return (
        <components.Option {...innerProps} {...props}>
            {' '}
            <div className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="input-select__icon"> */}
                    {/* <span className="mr-2">{props.data.icon}</span> */}
                    {/* </span> */}
                    <div
                        style={{
                            width: '20px',
                            height: '10px',
                            backgroundColor: 'blue',
                        }}
                        className="mr-2"
                    ></div>
                    <span className="mr-6" style={{ width: '40px' }}>
                        {props.data.phonePrefix}
                    </span>
                    <span>{props.data.name}</span>
                </div>
            </div>
        </components.Option>
    );
};
