import { useState } from 'react';

import ICompletedLesson from '../../my-bookings/interfaces/ICompletedLesson';
import IGroupedList from '../interfaces/IGroupedList';
import CompletedLessonsItem from './CompletedLessonsItem';

interface Props {
    studentId: string;
    groupedList: IGroupedList;
    activeLesson: ICompletedLesson | null;
    index: number;
    handleActiveLessons: (lessonId: string) => void;
}

const GroupedLessons = (props: Props) => {
    const { groupedList, activeLesson, studentId, index, handleActiveLessons } = props;
    const [isCollapsed, setIsCollapsed] = useState(index === 0 ? false : true);

    return (
        <>
            <>
                <div key={studentId}>
                    <div className="lessons-list__group" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <div className="lessons-list__group__name">
                            {groupedList[studentId][0].User.firstName}&nbsp;
                            {groupedList[studentId][0].User.lastName}&nbsp;
                            <span className="lessons-list__group__count">{groupedList[studentId].length}</span>
                        </div>
                        <div>
                            <i className={`icon icon--base icon--chevron-up lessons-list__group__icon ${isCollapsed && 'rotate--180'}`}></i>
                        </div>
                    </div>
                    <div style={{ display: isCollapsed ? 'none' : 'block' }}>
                        {groupedList[studentId].map((lesson: ICompletedLesson) => {
                            return (
                                <CompletedLessonsItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    activeLesson={activeLesson ? activeLesson.id : ''}
                                    handleActiveLessons={handleActiveLessons}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="lessons-list__group--border"></div>
            </>
        </>
    );
};

export default GroupedLessons;
