import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useOutsideAlerter from '../../../utils/useOutsideAlerter';
import { useAppSelector } from '../../../store/hooks';
import {
  allActiveSubjects,
} from '../../register/sign_up_rework/student_and_parent/subjects';

interface Props {
  subjects: string[];
  numOfSubjectsShown?: number;
}

/**
 * CustomSubjectListLonger Component
 * Displays a list of subjects.
 *
 * @param {string[]} subjects - The list of subjects to display.
 * @param {number} [numOfSubjectsShowed=3] - The number of subjects to show initially. Default is 3. Others will be shown like +X
 */
const CustomSubjectList = (props: Props) => {
  const { subjects, numOfSubjectsShown= 3 } = props;
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const rangeSetterRef = useRef<HTMLDivElement>(null);

  const hideTooltip = () => {
    setShowTooltip(false);
  };

  useOutsideAlerter(rangeSetterRef, hideTooltip);

  const filtersState = useAppSelector((state) => state.searchFilters);
  const { subject: subjectInFilter } = filtersState;

  const sortedSubjects = subjects.slice().sort((a, b) => {
    if (subjectInFilter) {
      if (a === allActiveSubjects.find(sub => sub.id == subjectInFilter)?.abrv) return -1;
      if (b === allActiveSubjects.find(sub => sub.id == subjectInFilter)?.abrv) return 1;
    }
    return a.localeCompare(b);
  });

  return (
    <div ref={rangeSetterRef} className='flex flex--wrap flex--ai--center'>
      {sortedSubjects.slice(0, numOfSubjectsShown).map((subject) => (
        <span className='tag tag--primary' key={subject}>
                    {t(`SUBJECTS.${subject.replaceAll('-', '')}`)}
                </span>
      ))}

      {sortedSubjects.length > numOfSubjectsShown ? (
        <div className='pos--rel'>
                    <span
                      className='type--color--brand cur--pointer'
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                        {`+ ${sortedSubjects.length - numOfSubjectsShown} ${t(
                          'SEARCH_TUTORS.SUBJECT_LIST.MORE',
                        )}`}{' '}
                    </span>
          <div
            className={`tooltip--text ${
              showTooltip ? 'active' : ''
            }`}
          >
            {sortedSubjects.slice(numOfSubjectsShown).map((subject) => (
              <span
                className='type--color--brand'
                key={subject}
              >
                {t(`SUBJECTS.${subject.replaceAll('-', '').replace(' ', '').toLowerCase()}`)}
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
