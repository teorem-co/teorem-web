import { components } from 'react-select';

export const countryOption = (props: any) => {
    const { innerProps, data } = props;
    return (
        <components.Option {...innerProps} {...props}>
            {' '}
            <div className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="mr-2">{props.data.icon}</span> */}
                    <div className="mr-2 flex">
                        {data.icon ? (
                            <img
                                className="react-select__flag"
                                src={data.icon}
                                alt="country flag"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <span>{props.data.label}</span>
                </div>
            </div>
        </components.Option>
    );
};
