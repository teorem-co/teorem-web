import MainWrapper from '../../components/MainWrapper';

const CompletedLessons = () => {
    return (
        <>
            <MainWrapper>
                <div className="card--lessons">
                    <div className="card--lessons__head">
                        <div>Completed Lessons</div>
                    </div>
                    <div className="card--lessons__body">
                        <div className="card--lessons__body__aside">aside</div>
                        <div className="card--lessons__body__main">main</div>
                    </div>
                </div>
            </MainWrapper>
        </>
    );
};

export default CompletedLessons;
