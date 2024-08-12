import MainWrapper from '../../components/MainWrapper';
import { useEffect, useRef, useState } from 'react';
import {
  ITutorStudentSearch,
  useLazyGetStudentInformationQuery,
} from '../../store/services/userService';
import IParams from '../../types/IParams';
import IPage from '../../types/notification/IPage';
import { t } from 'i18next';
import { PATHS } from '../../routes';
import { useHistory } from 'react-router-dom';
import moment from 'moment/moment';
import { useAppSelector } from '../../store/hooks';

export const StudentManagement = () => {
  const history = useHistory();
  const [searchStudents] = useLazyGetStudentInformationQuery();
  const [loadedStudentItems, setLoadedStudentItems] = useState<ITutorStudentSearch[]>([]);
  const [studentResponse, setStudentResponse] = useState<IPage<ITutorStudentSearch>>();
  const totalPages = studentResponse?.totalPages ?? 3;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tableRef = useRef<HTMLTableSectionElement>(null);
  const countriesState = useAppSelector((state) => state.countryMarket);

  const [params, setParams] = useState<IParams>({
    rpp: 30,
    page: 0,
    search: '',
  });
  const fetchData = async () => {
    const studentsResponse = await searchStudents({
      ...params,
      countryId: countriesState.selectedCountry?.id,
    }).unwrap();

    setStudentResponse(studentsResponse);
    setLoadedStudentItems(studentsResponse.content);
    tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    searchInputRef.current?.value && searchInputRef.current?.value.length > 0
      ? setParams({
        ...params,
        page: 0,
        search: searchInputRef.current.value,
      })
      : setParams({ ...params, search: '' });
  };
  return (
    <MainWrapper>
      <div className='card--secondary__body tutor-managment-card'>
        <div
          className='flex flex--center'
          style={{ width: '400px', margin: '10px auto' }}
        >
          <i className='icon icon--md icon--search icon--black search-icon'></i>
          <input
            ref={searchInputRef}
            type='text'
            onKeyUp={handleSearch}
            placeholder={t('STUDENT_MANAGEMENT.SEARCH_PLACEHOLDER')}
            className='input p-4'
          />
        </div>
        <div className='tutor-list flex flex--grow'>
          <table className='bookings-table'>
            <thead>
            <tr>
              <td width={150}
                  className='type--color--secondary mb-3 mb-xl-0'>{t('STUDENT_MANAGEMENT.TABLE.FIRST_NAME')}</td>
              <td width={150}
                  className='type--color--secondary mb-3 mb-xl-0'>{t('STUDENT_MANAGEMENT.TABLE.LAST_NAME')}</td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('STUDENT_MANAGEMENT.TABLE.ROLE')}
              </td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('STUDENT_MANAGEMENT.TABLE.NUMBER_OF_LESSONS')}
              </td>
              <td width={100} className='type--color--secondary mb-3 mb-xl-0'>
                {t('STUDENT_MANAGEMENT.TABLE.CREDITS')}
              </td>
              <td width={200} className='type--color--secondary mb-3 mb-xl-0'>
                {t('TUTOR_MANAGMENT.TABLE.CREATED_AT')}
              </td>
            </tr>
            </thead>

            {loadedStudentItems.length > 0 ?
              <tbody className='student-table-scrollable-tbody' ref={tableRef}>
              <tr></tr>
              {loadedStudentItems.map((student: ITutorStudentSearch, key) => (
                <tr key={key}
                    onClick={() => history.push(PATHS.STUDENT_PROFILE.replace(':userId', student.id))}>
                  <td width={150}>{student.firstName}</td>
                  <td width={150}>{student.lastName}</td>
                  <td width={100}>{student.role}</td>
                  <td width={100}>{student.numberOfCompletedLessons}</td>
                  <td width={100}>{student.creditsAmount}</td>
                  <td
                    width={200}>{moment(student.createdAt).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
              </tbody>
              :
              <div className='tutor-list__no-results'>
                <h1
                  className='tutor-list__no-results__title'>{t('STUDENT_MANAGEMENT.NO_RESULT.TITLE')}</h1>
                <p
                  className='tutor-list__no-results__subtitle'>{t('STUDENT_MANAGEMENT.NO_RESULT.DESC')}</p>
              </div>
            }
          </table>
        </div>
        <div className='mt-2 flex--center'>
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
    </MainWrapper>
  );
};
