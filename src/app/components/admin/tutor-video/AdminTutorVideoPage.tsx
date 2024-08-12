import {
  IAdminTutorVideoInformation,
  useLazyGetAdminTutorVideoInformationQuery,
} from '../../../store/services/tutorService';
import { AdminTutorVideoItem } from './AdminTutorVideoItem';
import React, { useEffect, useState } from 'react';
import IParams from '../../../types/IParams';
import { t } from 'i18next';
import MainWrapper from '../../MainWrapper';
import { useAppSelector } from '../../../store/hooks';

export const AdminTutorVideoPage = () => {
  const [getAdminTutorVideos, { data: tutorVideoData }] = useLazyGetAdminTutorVideoInformationQuery();
  const [loadedTutorVideosInfo, setLoadedTutorVideosInfo] = useState<IAdminTutorVideoInformation[]>([]);
  const totalPages = tutorVideoData?.totalPages ?? 3;
  const [activeTab, setActiveTab] = useState('unprocessed');
  const switchTab = (tab: string) => setActiveTab(tab);
  const [params, setParams] = useState<IParams>({
    rpp: 20,
    page: 0,
    videoApproved: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, params]);

  useEffect(() => {
    setParams({ ...params, page: 0 });
  }, [activeTab]);

  const countriesState = useAppSelector((state) => state.countryMarket);

  const fetchData = async () => {
    const tutorResponse = await getAdminTutorVideos({
      ...params,
      countryId: countriesState.selectedCountry?.id,
    }).unwrap();
    setLoadedTutorVideosInfo(tutorResponse.content);
  };

  return (
    <MainWrapper>
      <div className='card--secondary'>
        <div
          className='card--secondary__head card--secondary__head--search-tutor tutor-managment-head'>
          <div
            className='type--lg type--wgt--bold mb-4 mb-xl-0 absolute-left'>{t('TUTOR_MANAGMENT.TITLE')}</div>
        </div>
        <div
          className='tutors--table--tab--select card--secondary__head card--secondary__head--search-tutor'>
          <div
            className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'unprocessed' ? 'active' : ''}`}
            onClick={() => {
              switchTab('unprocessed');
              setParams({ ...params, videoApproved: false });
            }}
          >
            {t('TUTOR_MANAGMENT.UNPROCESSED')}
          </div>
          <div
            className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => {
              switchTab('approved');
              setParams({ ...params, videoApproved: true });
            }}
          >
            {t('TUTOR_MANAGMENT.APPROVED')}
          </div>
        </div>

        {loadedTutorVideosInfo.length > 0 ? (
          <div
            className='card--secondary__body tutor-managment-card tutor-list'>
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
                <td className='type--color--secondary mb-3 mb-xl-0'>Video</td>
                <td className='type--color--secondary mb-3 mb-xl-0'></td>
              </tr>
              </thead>

              <tbody className='table-scrollable-tbody'>
              <tr></tr>
              {loadedTutorVideosInfo.map((tutorVideoInfo) => {
                return <AdminTutorVideoItem fetchData={fetchData}
                                            tutorVideoInfo={tutorVideoInfo} />;
              })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='tutor-list__no-results'>
            <h1
              className='tutor-list__no-results__title'>{t('TUTOR_MANAGMENT.NO_RESULT.TITLE')}</h1>
            <p
              className='tutor-list__no-results__subtitle'>{t('TUTOR_MANAGMENT.NO_RESULT.DESC')}</p>
          </div>
        )}

        {loadedTutorVideosInfo.length > 0 && (
          <div className='mt-6 flex--center'>
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
        )}
      </div>
    </MainWrapper>
  );
};
