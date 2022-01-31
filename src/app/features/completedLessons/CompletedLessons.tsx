import MainWrapper from '../../components/MainWrapper';
import completedLessonsList, {
    ICompletedLesson,
} from '../../constants/completedLessonsList';
import CompletedLessonsItem from './components/CompletedLessonsItem';

const CompletedLessons = () => {
    return (
        <>
            <MainWrapper>
                <div className="card--lessons">
                    <div className="card--lessons__head">
                        <div>Completed Lessons</div>
                    </div>
                    <div className="card--lessons__body">
                        <div className="card--lessons__body__aside">
                            <div className="mt-10 mb-10 ml-6 mr-6">
                                <span className="type--uppercase type--color--tertiary">
                                    Tutor Available
                                </span>
                                <span className="tag--primary d--ib ml-2">
                                    14
                                </span>
                            </div>
                            <div className="lessons-list">
                                {completedLessonsList.map(
                                    (lesson: ICompletedLesson) => {
                                        return (
                                            <CompletedLessonsItem
                                                lesson={lesson}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                        <div className="card--lessons__body__main">main</div>
                    </div>
                </div>
            </MainWrapper>
        </>
    );
};

export default CompletedLessons;
