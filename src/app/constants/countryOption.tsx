import { components } from 'react-select';

export const countryOption = (props: any) => {
    const { innerProps } = props;
    return (
        <components.Option {...innerProps} {...props}>
            {' '}
            <div className="input-select">
                <div className="input-select__option flex flex--center">
                    {/* <span className="mr-2">{props.data.icon}</span> */}
                    <div className="mr-2">
                        {props.flag ? (
                            <img src={props.flag} alt="country flag" />
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
