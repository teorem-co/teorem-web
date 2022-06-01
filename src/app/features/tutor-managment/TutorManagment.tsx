import { Form, FormikProvider, useFormik } from 'formik';
import { networkInterfaces, userInfo } from 'os';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from "react-router-dom";

import searchIcon from '../../../assets/icons/search-tutors.svg';
import IParams from '../../../interfaces/IParams';
import { useApproveTutorMutation, useDeleteTutorMutation, useDenyTutorMutation, useLazyGetTutorsQuery, useLazySearchTutorsQuery } from '../../../services/tutorService';
import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import LoaderTutor from '../../components/skeleton-loaders/LoaderTutor';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';

const TutorManagment = () => {
    const history = useHistory();
    const [closeModal, setCloseModal] = useState<boolean>(true);
    const [tutorDenySent, setTutorDenySent] = useState<boolean>(false);
    const [selectedTutor, setSelectedTutor] = useState<any>();
    const [activeTab, setActiveTab] = useState<string>('unprocessed');
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const editNoteRef = useRef<HTMLTextAreaElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const [
        getTutors,
        {
            isLoading: isLoadingAvailableTutors,
            isUninitialized: availableTutorsUninitialized,
            isFetching: availableTutorsFetching,
        },
    ] = useLazyGetTutorsQuery();
    const [
        searchTutors,
        {
            isLoading: isLoadingSearchTutors,
            isFetching: searchTutorsFetching,
        },
    ] = useLazySearchTutorsQuery();
    const [
        approveTutor,
        {isSuccess: isSuccessApproveTutor},
    ] = useApproveTutorMutation();
    const [
        denyTutor,
        {isSuccess: isSuccessDenyTutor},
    ] = useDenyTutorMutation();
    const [
        deleteTutor,
        {isSuccess: isSuccessDeleteTutors},
    ] = useDeleteTutorMutation();

    const handleDenyTutor = (tutor:any) => {
        setSelectedTutor(tutor);
        setCloseModal(!closeModal);
    };

    const [params, setParams] = useState<IParams>({ 
        rpp: 10, 
        page: 1, 
        verified: 0, 
        unprocessed: 1,
        search: '',
    });
    const [loadedTutorItems, setLoadedTutorItems] = useState<any[]>([]);
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const isLoading = isLoadingAvailableTutors || availableTutorsUninitialized || availableTutorsFetching || isLoadingSearchTutors || searchTutorsFetching;
    
    const fetchData = async () => {
        const tutorResponse = params.search === '' ? 
            await getTutors(params).unwrap() :
            await searchTutors(params).unwrap();
            
        setLoadedTutorItems(tutorResponse.rows);
    };

    const switchTab = (tab: string) => {
        switch( tab ){
            case 'unprocessed':
                setParams({...params, verified: 0, unprocessed: 1});
                break;
            case 'approved':
                setParams({...params, verified: 1, unprocessed: 0});
                break;
            case 'denied':
                setParams({...params, verified: 2, unprocessed: 0});
                break;
        }
        setActiveTab(tab);
    };

    const handleSearch = () => {
        searchInputRef.current?.value && searchInputRef.current?.value.length > 0 ?
            setParams({...params, search: searchInputRef.current.value}) :
            setParams({...params, search: ''});
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [params, isSuccessDenyTutor, isSuccessApproveTutor, isSuccessDeleteTutors]);

    return (
        <MainWrapper>
            <div className="card--secondary" ref={cardRef}>
                <div className="card--secondary__head card--secondary__head--search-tutor tutor-managment-head">
                    <div className="type--lg type--wgt--bold mb-4 mb-xl-0 absolute-left">{t('TUTOR_MANAGMENT.TITLE')}</div>
                    <div className="flex flex--center search-container" style={{position: "relative"}}>
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
                        onClick={()=>switchTab('unprocessed') }
                    >{t('TUTOR_MANAGMENT.UNPROCESSED')}</div>
                    <div 
                        className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'approved' ? 'active' : ''}`}  
                        onClick={()=>switchTab('approved') }
                    >{t('TUTOR_MANAGMENT.APPROVED')}</div>
                    <div 
                        className={`tutors--table--tab type--color--secondary mb-3 mb-xl-0 ${activeTab === 'denied' ? 'active' : ''}`}  
                        onClick={()=>switchTab('denied') }
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
                                <tbody>
                                <tr>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.FIRST_NAME')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.LAST_NAME')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.EMAIL')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.COUNTRY')}</td>
                                <td className="type--color--secondary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.TABLE.DATE_OF_BIRTH')}</td>
                                </tr>
                            {loadedTutorItems.map((tutor, key) => <tr key={key}>
                                <td onClick={()=>{ 
                                    activeTab == 'unprocessed' ? 
                                        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)) : 
                                        setSelectedTutor(tutor);}} 
                                >{tutor.User.firstName}</td>
                                <td onClick={()=>{ 
                                    activeTab == 'unprocessed' ? 
                                        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)) : 
                                        setSelectedTutor(tutor);}} 
                                >{tutor.User.lastName}</td>
                                <td onClick={()=>{ 
                                    activeTab == 'unprocessed' ? 
                                        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)) : 
                                        setSelectedTutor(tutor);}} 
                                >{tutor.User.email}</td>
                                <td onClick={()=>{ 
                                    activeTab == 'unprocessed' ? 
                                        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)) : 
                                        setSelectedTutor(tutor);}} 
                                ><img className="react-select__flag" src={tutor.User.Country.flag} />{tutor.User.Country.name}</td>
                                <td onClick={()=>{ 
                                    activeTab == 'unprocessed' ? 
                                        history.push(PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)) : 
                                        setSelectedTutor(tutor);}} 
                                >{tutor.User.dateOfBirth}</td>
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
                                    <td className='menu-container'><Link to={PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE.replace(':tutorId', tutor.userId)} >{t('TUTOR_MANAGMENT.TABLE.PREVIEW_PROFILE')}</Link>
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
                                                <i className={`icon icon--${tutor.verified ? 'close' : 'check'} icon--sm icon--grey`}></i>
                                                {!tutor.verified ?  
                                                    t('TUTOR_MANAGMENT.ACTIONS.APPROVE') :
                                                    t('TUTOR_MANAGMENT.ACTIONS.DECLINE') }
                                            </button>
                                            <button
                                                className="btn btn--base btn--clear"
                                                onClick={() => deleteTutor(tutor.userId)}
                                            >
                                                <i className="icon icon--delete icon--sm icon--red"></i>
                                                {t('TUTOR_MANAGMENT.ACTIONS.DELETE')}
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
                    </div>
                </div>
            </div>

            <div className={`modal tutor--managment ${closeModal && 'closed'}`}>
                <div className="tutors--table--tab--select card--secondary__head card--secondary__head--search-tutor">
                    <div className="type--md type--wgt--bold mb-4 mb-xl-0">{t('TUTOR_MANAGMENT.TITLE')}</div>
                    <p className="type--color--secondary mb-3 mb-xl-0">{selectedTutor?.User.email}</p>
                </div>
                <div className="card--secondary__body tutor-managment-card">
                    <p className="type--color--primary mb-3 mb-xl-0">{t('TUTOR_MANAGMENT.NOTE')}</p>
                    <textarea 
                        placeholder={t('TUTOR_MANAGMENT.NOTE_PLACEHOLDER')}
                        ref={noteRef}
                    ></textarea>
                </div>
                {!tutorDenySent? 
                    (
                        <div className="card--secondary__body tutor-managment-card">
                            <button
                                className="btn btn--base btn--ghost modal-button--deny"
                                onClick={ async () => {
                                    await denyTutor({tutorId: selectedTutor?.userId, message: noteRef?.current?.value || ''});
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
                            style={{float: "right"}}
                            onClick={async () => {
                                await denyTutor({tutorId: selectedTutor?.userId, message: editNoteRef?.current?.value || ''});
                                setSelectedTutor(undefined);
                                }}
                        >
                        {t('TUTOR_MANAGMENT.ACTIONS.EDIT_NOTE')}
                        </button> 
                    </div>
                    } //: JSX.Element | JSX.Element[];
                sideBarIsOpen={selectedTutor && closeModal} //: boolean;
                title={selectedTutor?.User?.firstName.toUpperCase() + ' ' + selectedTutor?.User?.lastName.toUpperCase() + t('TUTOR_MANAGMENT.DETAILS')} //: string;
                closeSidebar={()=>{setSelectedTutor(undefined);}} //: () => void;
                onSubmit={()=>{approveTutor(selectedTutor?.userId);}} //: () => void;
                onCancel={()=>{deleteTutor(selectedTutor?.userId);}} //: () => void;
                submitLabel={t('TUTOR_MANAGMENT.ACTIONS.APPROVE_TUTOR')} //: string;
                cancelLabel={t('TUTOR_MANAGMENT.ACTIONS.DELETE_TUTOR')} //: string;
            />
        </MainWrapper>
    );
};

export default TutorManagment;
