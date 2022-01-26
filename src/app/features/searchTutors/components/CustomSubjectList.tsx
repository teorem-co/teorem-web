import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ISubject from '../../../../interfaces/ISubject';

interface Props {
    subjects: ISubject[];
}

const CustomSubjectList = (props: Props) => {
    const { subjects } = props;

    const { t } = useTranslation();
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex">
            {subjects.slice(0, 3).map((subject) => (
                <span className="tag tag--primary" key={subject.id}>
                    {subject.name}
                </span>
            ))}

            {subjects.length > 3 ? (
                <div className="pos--rel">
                    <span
                        className="type--color--brand cur--pointer"
                        onClick={() => setShowTooltip(!showTooltip)}
                    >
                        {`+ ${subjects.length - 3} ${t(
                            'SEARCH_TUTORS.SUBJECT_LIST.MORE'
                        )}`}{' '}
                    </span>
                    <div
                        className={`tooltip--text ${
                            showTooltip ? 'active' : ''
                        }`}
                    >
                        {subjects.slice(3).map((subject) => (
                            <span
                                className="type--color--white p-1"
                                key={subject.id}
                            >
                                {subject.name}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default CustomSubjectList;
