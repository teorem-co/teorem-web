import MainWrapper from '../../components/MainWrapper';
import { useEffect, useState } from 'react';
import {
  ITutorStudentSearch,
  useLazyGetStudentInformationQuery,
} from '../../../services/userService';
import IParams from '../../../interfaces/IParams';
import IPage from '../../../interfaces/notification/IPage';
import { t } from 'i18next';

export const StudentManagement = () => {
  const [searchStudents, {
    isLoading: isLoadingSearchStudents,
    isFetching: searchStudentsFetching,
  }] = useLazyGetStudentInformationQuery();
  const [loadedStudentItems, setLoadedStudentItems] = useState<ITutorStudentSearch[]>([]);
  const [studentResponse, setStudentResponse] = useState<IPage<ITutorStudentSearch>>();
  const totalPages = studentResponse?.totalPages ?? 3;

  const [params, setParams] = useState<IParams>({
    rpp: 20,
    page: 0,
    verified: 0,
    unprocessed: 1,
    search: '',
  });
  const fetchData = async () => {
    const studentsResponse = await searchStudents(params).unwrap();

    setStudentResponse(studentsResponse);
    setLoadedStudentItems(studentsResponse.content);
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [params]);

  return (
    <MainWrapper>
      <div className='card--secondary__body tutor-managment-card'>
        <div className='tutor-list'>
          <table className='tutors-table'>
            <thead>
            <tr>
              <td
                className='type--color--secondary mb-3 mb-xl-0'>{t('TUTOR_MANAGMENT.TABLE.FIRST_NAME')}</td>
              <td
                className='type--color--secondary mb-3 mb-xl-0'>{t('TUTOR_MANAGMENT.TABLE.LAST_NAME')}</td>
              <td
                className='type--color--secondary mb-3 mb-xl-0'>{t('TUTOR_MANAGMENT.TABLE.EMAIL')}</td>
              <td
                className='type--color--secondary mb-3 mb-xl-0'>{t('TUTOR_MANAGMENT.TABLE.PHONE_NUMBER')}</td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('TUTOR_MANAGMENT.TABLE.ROLE')}
              </td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('TUTOR_MANAGMENT.TABLE.NUMBER_OF_LESSONS')}
              </td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('TUTOR_MANAGMENT.TABLE.CREDITS')}
              </td>
            </tr>
            </thead>

            <tbody className='student-table-scrollable-tbody'>
            <tr></tr>
            {loadedStudentItems.map((student: ITutorStudentSearch, key) => (
              <tr key={key}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td width={100}>{student.role}</td>
                <td width={100}>{student.numberOfCompletedLessons}</td>
                <td width={100}>{student.creditsAmount}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <div className='mt-6 flex--center'>
            {/* Previous Button */}
            <button
              className='btn btn--base'
              onClick={() =>
                setParams((prevState) => ({
                  ...prevState,
                  page: prevState.page > 0 ? prevState.page - 1 : 0,
                }))
              }
              disabled={params.page <= 0}
            >
              <span>←</span> prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`btn--base ml-2 ${params.page === index ? 'btn-active' : ''}`}
                onClick={() => setParams({ ...params, page: index })}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              className='btn btn--base ml-2'
              onClick={() =>
                setParams((prevState) => ({
                  ...prevState,
                  page: prevState.page + 1,
                }))
              }
              disabled={params.page >= totalPages - 1}
            >
              next <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};
