import { t } from 'i18next';

import ITutorSubjectLevel from '../../../../interfaces/ITutorSubjectLevel';

interface IProps {
    tutorSubjects: ITutorSubjectLevel[];
    currency: string;
    handleSendId: (objectId: string) => void;
}

const SubjectList: React.FC<IProps> = (props) => {
    const { tutorSubjects, currency, handleSendId } = props;
    return (
        <>
            {tutorSubjects ? (
                tutorSubjects.map((subject) => (
                    <div className="dash-wrapper__item" key={subject.id}>
                        <div className="dash-wrapper__item__element" onClick={() => handleSendId(subject.id)}>
                            <div className="flex--primary subject cur--pointer">
                                <div>
                                    <div className="type--wgt--bold">
                                        {t(`SUBJECTS.${subject.Subject.abrv?.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
                                    </div>
                                    <div>{t(`LEVELS.${subject.Level.abrv?.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}</div>
                                </div>
                                <div className="type--wgt--bold price">
                                    {subject.price} {currency}
                                </div>
                                <div>
                                    <i className="icon icon--base icon--edit icon--primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
        </>
    );
};

export default SubjectList;
