import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ISubject from '../../../types/ISubject';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';

interface Props {
    subjects: ISubject[];
}

const CustomSubjectList = (props: Props) => {
    const { subjects } = props;

    const { t } = useTranslation();
    const [showTooltip, setShowTooltip] = useState(false);

    const rangeSetterRef = useRef<HTMLDivElement>(null);

    const hideTooltip = () => {
        setShowTooltip(false);
    };

    useOutsideAlerter(rangeSetterRef, hideTooltip);

    return (
        <div ref={rangeSetterRef} className="flex">
            {subjects.slice(0, 3).map((subject) => (
                <span className="tag tag--primary" key={subject.id}>
                    {t(`SUBJECTS.${subject.abrv.replaceAll('-', '').replace(' ', '').toLowerCase()}`)}
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
                                className="type--color--brand"
                                key={subject.id}
                            >
                                {t(`SUBJECTS.${subject.abrv.replaceAll('-', '').replace(' ', '').toLowerCase()}`)}
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
