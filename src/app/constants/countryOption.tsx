import { components } from 'react-select';

export const countryOption = (props: any) => {
    const { innerProps } = props;
    return (
        <components.Option {...innerProps} {...props}>
            {' '}
            <div className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="mr-2">{props.data.icon}</span> */}
                    <div
                        style={{
                            width: '20px',
                            height: '10px',
                            backgroundColor: 'blue',
                        }}
                        className="mr-2"
                    ></div>
                    <span>{props.data.name}</span>
                </div>
            </div>
        </components.Option>
    );
};
