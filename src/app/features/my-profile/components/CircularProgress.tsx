interface Props {
    progressNumber: number;
    size?: number;
    className?:string;
}

const CircularProgress = (props: Props) => {
    const { progressNumber, size, className} = props;
    return (
        <div className={`flex flex--justify-center flex--center spc--top--lg ${className}`}
             style={size ? {width: size, height: size} : undefined}>
            <svg
                className="progress--circular spc--right--md"
                x="0px"
                y="0px"
                viewBox="0 0 80 80"
            >
                <path
                    className="progress--circular__track"
                    d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
                />
                <path
                    className="progress--circular__fill"
                    d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
                    style={{
                        strokeDashoffset: `${
                            (progressNumber ? progressNumber : 1) * 2.2 + 300
                        }px`,
                    }}
                />
                <text className="progress--circular__value" x="52%" y="61%">
                    {progressNumber}%
                </text>
            </svg>
        </div>
    );
};

export default CircularProgress;
