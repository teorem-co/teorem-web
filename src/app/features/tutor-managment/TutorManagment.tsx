import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import IParams from '../../../interfaces/IParams';
import {
  ITutorAdminSearch,
  useApproveTutorMutation,
  useDeleteTutorMutation,
  useDenyTutorMutation,
  useLazySearchTutorsQuery,
} from '../../../services/tutorService';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import LoaderTutor from '../../components/skeleton-loaders/LoaderTutor';
import { PATHS } from '../../routes';
import IPage from '../../../interfaces/notification/IPage';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';
import {
  parsePhoneNumberFromString,
  CountryCode,
  AsYouType,
  getCountries
} from 'libphonenumber-js';


const TutorManagment = () => {
    const history = useHistory();
    const [closeModal, setCloseModal] = useState<boolean>(true);
    const [tutorDenySent, setTutorDenySent] = useState<boolean>(false);
    const [selectedTutor, setSelectedTutor] = useState<ITutorAdminSearch>();
    const [activeTab, setActiveTab] = useState<string>('unprocessed');
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const editNoteRef = useRef<HTMLTextAreaElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [tutorResponse, setTutorResponse] = useState<IPage<ITutorAdminSearch>>();
    const totalPages = tutorResponse?.totalPages ?? 3;

    const [
        searchTutors,
        {
            isLoading: isLoadingSearchTutors,
            isFetching: searchTutorsFetching,
        },
    ] = useLazySearchTutorsQuery();
    const [
        approveTutor,
        { isSuccess: isSuccessApproveTutor },
    ] = useApproveTutorMutation();
    const [
        denyTutor,
        { isSuccess: isSuccessDenyTutor },
    ] = useDenyTutorMutation();
    const [
        deleteTutor,
        { isSuccess: isSuccessDeleteTutors },
    ] = useDeleteTutorMutation();

    const handleDenyTutor = (tutor: any) => {
        setSelectedTutor(tutor);
        setCloseModal(!closeModal);
    };

    const [params, setParams] = useState<IParams>({
        rpp: 10,
        page: 0,
        verified: 0,
        unprocessed: 1,
        search: '',
    });
    const [loadedTutorItems, setLoadedTutorItems] = useState<ITutorAdminSearch[]>([]);
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const isLoading =  isLoadingSearchTutors || searchTutorsFetching;

    const fetchData = async () => {
        //TODO: refactor to use PageResponse<>
        const tutorResponse = await searchTutors(params).unwrap();

        setTutorResponse(tutorResponse);
        setLoadedTutorItems(tutorResponse.content);
    };

    const switchTab = (tab: string) => {
        switch (tab) {
            case 'unprocessed':
                setParams({ ...params, verified: 0, unprocessed: 1, page: 0});
                break;
            case 'approved':
                setParams({ ...params, verified: 1, unprocessed: 0, page: 0});
                break;
            case 'denied':
                setParams({ ...params, verified: 2, unprocessed: 0, page: 0});
                break;
        }
        setActiveTab(tab);
    };

    const handleSearch = () => {
        searchInputRef.current?.value && searchInputRef.current?.value.length > 0 ?
            setParams({ ...params, search: searchInputRef.current.value }) :
            setParams({ ...params, search: '' });
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [params, isSuccessDenyTutor, isSuccessApproveTutor, isSuccessDeleteTutors]);


    function formatPhoneNumber(input: string, countryCode: string) {
      const allCountryCodes = getCountries(); // get all valid country codes

      if (!allCountryCodes.includes(countryCode as CountryCode)) {
        console.error(`Invalid country code: ${countryCode}`);
        return input; // or throw an error, or handle it however you want
      }

      const phoneNumber = parsePhoneNumberFromString(input, countryCode as CountryCode);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
      return input;
  }

    return (
        <MainWrapper>
            <div className="card--secondary" ref={cardRef}>
                <div className="card--secondary__head card--secondary__head--search-tutor tutor-managment-head">
                    <div className="type--lg type--wgt--bold mb-4 mb-xl-0 absolute-left">{t('TUTOR_MANAGMENT.TITLE')}</div>
                    <div className="flex flex--center search-container" style={{ position: "relative" }}>
                        <i className="icon icon--md icon--search icon--black search-icon"></i>
                        <input ref={searchInputRef}
                            type="text"
                            onKeyUp={handleSearch}
                            placeholder={t('TUTOR_MANAGMENT.SEARCH_PLACEHOLDER')}
                            className="input p-4 pl-12" />
                    </div>
                </div>
                <div className="tutors--table--tab--select card--secondary__head card--secondary__head--search-tutor">
                    <div
                        className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'unprocessed' ? 'active' : ''}`}
                        onClick={() => switchTab('unprocessed')}
                    >{t('TUTOR_MANAGMENT.UNPROCESSED')}</div>
                    <div
                        className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'approved' ? 'active' : ''}`}
                        onClick={() => switchTab('approved')}
                    >{t('TUTOR_MANAGMENT.APPROVED')}</div>
                    <div
                        className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'denied' ? 'active' : ''}`}
                        onClick={() => switchTab('denied')}
                    >{t('TUTOR_MANAGMENT.DENIED')}</div>
                </div>
                <div className="card--secondary__body tutor-managment-card">
                    <div className="tutor-list">
                        {isLoading ? (
                            // Here goes loader
                            <div className="loader--sceleton">
                                <LoaderTutor />
                                <LoaderTutor />
                                <LoaderTutor />
                            </div>
                        ) : loadedTutorItems.length > 0 ? (
                            <table className="tutors-table">
                              <thead>
                              <tr>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.FIRST_NAME')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.LAST_NAME')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.EMAIL')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.COUNTRY')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.PHONE_NUMBER')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0"></td>
                              </tr>
                              </thead>

                              <tbody className="table-scrollable-tbody">

                                    <tr></tr>
                                    {loadedTutorItems.map((tutor: ITutorAdminSearch, key) => <tr key={key}>

                                        <td onClick={() => {
                                            activeTab == 'unprocessed' ?
                                                history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)) :
                                                setSelectedTutor(tutor);
                                        }}
                                        >{tutor.firstName}</td>
                                        <td onClick={() => {
                                            activeTab == 'unprocessed' ?
                                                history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)) :
                                                setSelectedTutor(tutor);
                                        }}
                                        >{tutor.lastName}</td>
                                        <td onClick={() => {
                                            activeTab == 'unprocessed' ?
                                                history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)) :
                                                setSelectedTutor(tutor);
                                        }}
                                        >{tutor.email}</td>
                                        <td onClick={() => {
                                            activeTab == 'unprocessed' ?
                                                history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)) :
                                                setSelectedTutor(tutor);
                                        }}
                                        ><img className="react-select__flag" src={tutor.countryFlag} />{tutor.countryName}</td>
                                        <td onClick={() => {
                                            activeTab == 'unprocessed' ?
                                                history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)) :
                                                setSelectedTutor(tutor);
                                        }}
                                        >{formatPhoneNumber(tutor.phoneNumber, tutor.countryAbrv)}</td>
                                        {tutor.verified == null ? (
                                            <td className='approve-deny'>
                                                <button
                                                    className="btn btn--base btn--clear"
                                                    onClick={() => approveTutor(tutor.userId)}
                                                >
                                                    {t('TUTOR_MANAGMENT.ACTIONS.APPROVE')}
                                                </button>
                                                <button
                                                    className="btn btn--base btn--ghost"
                                                    onClick={() => handleDenyTutor(tutor)}
                                                >
                                                    {t('TUTOR_MANAGMENT.ACTIONS.DECLINE')}
                                                </button>
                                            </td>
                                        ) : (
                                            <td className='menu-container'><Link to={PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)} >{t('TUTOR_MANAGMENT.TABLE.PREVIEW_PROFILE')}</Link>
                                                <div className='dots' tabIndex={1}>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <div className='tutor-list-menu'>
                                                    <button
                                                        className="btn btn--base btn--clear"
                                                        onClick={() => !tutor.verified ? approveTutor(tutor.userId) : handleDenyTutor(tutor)}

                                                    >
                                                      {tutor.verified ?  <AiOutlineClose color={'red'} size={20}/> : <AiOutlineCheck size={20} color={'green'}/>}

                                                        <p
                                                          className={tutor.verified ? 'ml-2 text-red' : 'ml-2 text-green'}>{!tutor.verified ?
                                                          t('TUTOR_MANAGMENT.ACTIONS.APPROVE') :
                                                          'Suspend'}
                                                        </p>
                                                    </button>
                                                    <button
                                                        className="btn btn--base btn--clear"
                                                        onClick={() => { deleteTutor(tutor.userId); }}
                                                    >
                                                        <FiTrash color={'red'} size={20}/>
                                                        <p className='ml-2'>{t('TUTOR_MANAGMENT.ACTIONS.DELETE')}</p>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="tutor-list__no-results">
                                <h1 className="tutor-list__no-results__title">{t('TUTOR_MANAGMENT.NO_RESULT.TITLE')}</h1>
                                <p className="tutor-list__no-results__subtitle">{t('TUTOR_MANAGMENT.NO_RESULT.DESC')}</p>
                            </div>
                        )}
                        {/*<div className="mt-6 flex">*/}
                        {/*    <button className="btn btn--base" onClick={() => setParams(prevState => ({...prevState, page: prevState.page > 0 ? prevState.page - 1 : 1 }))} disabled={params.page - 1 < 1}>prev</button>*/}
                        {/*    <button className="btn btn--base ml-2" onClick={() => setParams(prevState => ({...prevState, page: prevState.page + 1}))}>next</button>*/}
                        {/*</div>*/}

                      <div className="mt-6 flex--center">
                        {/* Previous Button */}
                        <button
                          className="btn btn--base"
                          onClick={() => setParams(prevState => ({
                            ...prevState,
                            page: prevState.page > 0 ? prevState.page - 1 : 0
                          }))}
                          disabled={params.page <= 0}
                        >
                          <span>←</span> prev
                        </button>

                        {/* Page Numbers */}
                        {Array.from({length: totalPages }).map((_, index) => (
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
                          className="btn btn--base ml-2"
                          onClick={() => setParams(prevState => ({
                            ...prevState,
                            page: prevState.page + 1
                          }))}
                          disabled={params.page >= totalPages - 1}
                        >
                          next <span>→</span>
                        </button>
                      </div>

                    </div>
                </div>
            </div>

            <div className={`modal tutor--managment ${closeModal && 'closed'}`}>
                <div className="tutors--table--tab--select card--secondary__head card--secondary__head--search-tutor">
                    <div className="type--md type--wgt--bold mb-4 mb-xl-0">{t('TUTOR_MANAGMENT.TITLE')}</div>
                    <p className="type--color--secondary mb-3 mb-xl-0">{selectedTutor?.email}</p>
                </div>
                <div className="card--secondary__body tutor-managment-card">
                    <p className="type--color--primary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.NOTE')}</p>
                    <textarea
                        placeholder={t('TUTOR_MANAGMENT.NOTE_PLACEHOLDER')}
                        ref={noteRef}
                    ></textarea>
                </div>
                {!tutorDenySent ?
                    (
                        <div className="card--secondary__body tutor-managment-card">
                            <button
                                className="btn btn--base btn--ghost modal-button--deny"
                                onClick={async () => {
                                    await denyTutor({ tutorId: selectedTutor?.userId, message: noteRef?.current?.value || '' });
                                    setTutorDenySent(true);
                                }}
                            >
                                {t('TUTOR_MANAGMENT.ACTIONS.DECLINE')}
                            </button>
                            <button
                                className="btn btn--base btn--clear modal-button--cancel"
                                onClick={() => {
                                    setCloseModal(!closeModal);
                                    setSelectedTutor(undefined);
                                }}
                            >
                                {t('TUTOR_MANAGMENT.ACTIONS.CANCEL')}
                            </button>
                        </div>) :
                    (
                        <div className="card--secondary__body tutor-managment-card">
                            <button
                                className="btn btn--base btn--clear modal-button--cancel"
                                onClick={() => {
                                    setCloseModal(!closeModal);
                                    setTutorDenySent(false);
                                    setSelectedTutor(undefined);
                                }}
                            >
                                OK
                            </button>
                        </div>)
                }
            </div>

            <Sidebar
                children={
                    <div className="card--secondary__body tutor-managment-card">
                        <p className="type--color--primary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.NOTE')}</p>
                        <textarea
                            placeholder={t('TUTOR_MANAGMENT.NOTE_PLACEHOLDER')}
                            defaultValue={selectedTutor?.adminNote || undefined}
                            ref={editNoteRef}
                        ></textarea>
                        <button
                            className="btn btn--base btn--clear"
                            style={{ float: "right" }}
                            onClick={async () => {
                                await denyTutor({ tutorId: selectedTutor?.userId, message: editNoteRef?.current?.value || '' });
                                setSelectedTutor(undefined);
                            }}
                        >
                            {t('TUTOR_MANAGMENT.ACTIONS.EDIT_NOTE')}
                        </button>
                    </div>
                } //: JSX.Element | JSX.Element[];
                sideBarIsOpen={!!selectedTutor && closeModal} //: boolean;
                title={selectedTutor?.firstName.toUpperCase() + ' ' + selectedTutor?.lastName.toUpperCase() + t('TUTOR_MANAGMENT.DETAILS')} //: string;
                closeSidebar={() => { setSelectedTutor(undefined); }} //: () => void;
                onSubmit={() => { approveTutor(selectedTutor?.userId); }} //: () => void;
                onCancel={() => { deleteTutor(selectedTutor?.userId); }} //: () => void;
                submitLabel={t('TUTOR_MANAGMENT.ACTIONS.APPROVE_TUTOR')} //: string;
                cancelLabel={t('TUTOR_MANAGMENT.ACTIONS.DELETE_TUTOR')} //: string;
            />
        </MainWrapper>
    );
};

export default TutorManagment;
