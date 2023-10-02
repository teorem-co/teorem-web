import LoaderPrimary from "../../../components/skeleton-loaders/LoaderPrimary";
import SubjectList from "../../my-profile/components/SubjectList";
import EditSubjectSidebar from "../../my-profile/components/EditSubjectSidebar";
import AddSubjectSidebar from "../../my-profile/components/AddSubjectSidebar";
import {
  useLazyGetProfileProgressQuery,
  useLazyGetTutorByIdQuery
} from "../../../../services/tutorService";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {getUserId} from "../../../utils/getUserId";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import CircularProgress from "../../my-profile/components/CircularProgress";
import ISubject from "../../../../interfaces/ISubject";
import {AiOutlineLeft} from "react-icons/ai";
import {setStepOne, setStepTwo} from "../../../../slices/onboardingSlice";

interface SubjectsValues {
  subjects: ISubject[];
}

type SubjectsProps ={
  nextStep:() => void,
  backStep: () => void
};

//TODO: redesign like on TRM-93 image #2


const SubjectsPage = ({ nextStep, backStep }:SubjectsProps) => {

  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getProfileData, { data: myTeachingsData, isLoading: myTeachingsLoading, isUninitialized: myTeachingsUninitialized }] =
    useLazyGetTutorByIdQuery();

  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [saveBtnActive, setSaveBtnActive] = useState(true);

  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const tutorId = getUserId();
  const [currency, setCurrency] = useState('');
  const { t } = useTranslation();
  const isLoading = myTeachingsLoading || myTeachingsUninitialized;
  const history = useHistory();

  const closeAddSubjectSidebar = () => {
    setAddSidebarOpen(false);
  };

  const closeEditSubjectSidebar = () => {
    // history.location.search = '';
    history.push(t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS'));
    setEditSidebarOpen(false);
  };

  const handleSendId = (subjectId: string) => {
    history.push(`?subjectId=${subjectId}`);
    setEditSidebarOpen(true);
  };

  const fetchData = async () => {
    if (tutorId) {
      getProfileData(tutorId);

      const tutorCurrency = await (await getProfileData(tutorId).unwrap()).User.Country.currencyCode;
      setCurrency(tutorCurrency);

      //If there is no state in redux for profileProgress fetch data and save result to redux
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
        dispatch(setMyProfileProgress(progressResponse));
      }
    }
  };

  const handleSubmit = () => {
    if(tutorId) {
      dispatch(setStepOne({
        subjects: myTeachingsData?.TutorSubjects ? myTeachingsData.TutorSubjects : [],
      }));
    }
    nextStep();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(myTeachingsData?.TutorSubjects.length === undefined || myTeachingsData?.TutorSubjects.length === 0) {
      setSaveBtnActive(false);
    } else {
      setSaveBtnActive(true);
    }
  });

  return (
    <>
      <div>
        <div className='flex field__w-fit-content align--center flex--center'>
          <div className="flex flex--col flex--jc--center ml-6">
            <div style={{margin: "40px"}} className="flex flex--center">
              <AiOutlineLeft
                className={`ml-2 mr-6 cur--pointer signup-icon`}
                color='grey'
                onClick={backStep}
              />
              <div className="flex flex--center flex--shrink w--105">
                <CircularProgress progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0} size={80}  />
              </div>
              <div className="flex flex--col flex--jc--center ml-6">
                <h4 className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.MY_TEACHINGS.TITLE')}</h4>
              </div>
            </div>
          </div>
        </div>
        <div style={{justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          {(isLoading && <LoaderPrimary />) || (
            <div className="flex--center"  style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
              <div>
                <div className="dash-wrapper dash-wrapper--adaptive flex--grow" >
                  <div className="dash-wrapper__item">
                    <div className="dash-wrapper__item__element" onClick={() => setAddSidebarOpen(true)}>
                      <div className="flex--primary cur--pointer">
                        <div>
                          <div className="type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.ADD_NEW')}</div>
                          <div>{t('MY_PROFILE.MY_TEACHINGS.ADD_DESC')}</div>
                        </div>
                        <div>
                          <i className="icon icon--base icon--plus icon--primary"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Map through subjects here */}
                  {/* Test fields */}
                  <SubjectList
                    handleSendId={handleSendId}
                    tutorSubjects={myTeachingsData && myTeachingsData.TutorSubjects ? myTeachingsData.TutorSubjects : []}
                    currency={currency}
                    key={myTeachingsData && myTeachingsData.TutorSubjects.length}
                  />
                </div>
              </div>
            </div>
          )}
          <EditSubjectSidebar
            sideBarIsOpen={editSidebarOpen}
            closeSidebar={closeEditSubjectSidebar}
            handleGetData={() => getProfileData(tutorId ? tutorId : '')}
          />
          <AddSubjectSidebar
            key={myTeachingsData?.TutorSubjects.length}
            sideBarIsOpen={addSidebarOpen}
            closeSidebar={closeAddSubjectSidebar}
            handleGetData={() => getProfileData(tutorId ? tutorId : '')}
          />
        </div>
          <div className="flex--center" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <button onClick={() => handleSubmit()} disabled={!saveBtnActive} className="btn btn--base btn--primary mt-4">
              {t('REGISTER.NEXT_BUTTON')}
            </button>
          </div>
      </div>
      </>
  );
};

export default SubjectsPage;
