import LoaderPrimary from "../../../components/skeleton-loaders/LoaderPrimary";
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
import {
  ITutorSubject,
  setStepOne,
  setStepTwo,
} from '../../../../slices/onboardingSlice';
import { CreateSubjectCard } from './CreateSubjectCard';
import ITutorSubjectLevel from '../../../../interfaces/ITutorSubjectLevel';
import {
  ICreateSubjectOnboarding,
  useCreateSubjectsOnboardingMutation,
} from '../../../../services/subjectService';

interface SubjectsValues {
  subjects: ISubject[];
}

type SubjectsProps ={
  nextStep:() => void,
  backStep: () => void
};


const SubjectsPage = ({ nextStep, backStep }:SubjectsProps) => {

  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getProfileData, { data: myTeachingsData, isLoading: myTeachingsLoading, isUninitialized: myTeachingsUninitialized }] =
    useLazyGetTutorByIdQuery();

  const[createSubjectsOnboarding] = useCreateSubjectsOnboardingMutation();
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [saveBtnActive, setSaveBtnActive] = useState(false);

  const [btnDisabled, setBtnDisabled] = useState(true);
  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const tutorId = getUserId();
  const [currency, setCurrency] = useState('');
  const { t } = useTranslation();
  const isLoading = myTeachingsLoading || myTeachingsUninitialized;
  const history = useHistory();


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


  const [oldSubjects, setOldSubjects] = useState<ITutorSubjectLevel[]>([]);
  useEffect(() => {
    if(myTeachingsData){
      console.log("Fetched teachings", myTeachingsData.TutorSubjects);

      if(myTeachingsData.TutorSubjects.length == 0){
        forms.push({
          id:nextId,
          levelId:'',
          subjectId:'',
          price:''
        });

        return;
      }

      myTeachingsData.TutorSubjects.map((subjectInfo) =>{
        const subj:ITutorSubject =
          {
            id: subjectInfo.id,
            levelId: subjectInfo.levelId,
            subjectId:subjectInfo.subjectId,
            price:subjectInfo.price + ''
          };
        if (!forms.some(form => form.id === subj.id)) {
          forms.push(subj);
        }
      });
      setOldSubjects(myTeachingsData.TutorSubjects);
    }
  }, [myTeachingsData]);

  const handleSubmit = () => {
    if(tutorId) {

      dispatch(setStepOne({
        subjects: myTeachingsData?.TutorSubjects ? myTeachingsData.TutorSubjects : [],
      }));

      const noChanges = areArraysEqual(oldSubjects, forms);

      const mappedSubjects = mapToCreateSubject(forms);
      if(!noChanges){
        createSubjectsOnboarding({ tutorId: tutorId, subjects: mappedSubjects});
        dispatch(
          setMyProfileProgress({
            ...profileProgressState,
            myTeachings: true,
            percentage: profileProgressState.percentage + 25,
          })
        );
      }

    }
    nextStep();
  };

  function isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }

  function mapToCreateSubject(arr:ITutorSubject[]): ICreateSubjectOnboarding[] {
   const result:ICreateSubjectOnboarding[] = [];

    arr.forEach(subLev => {
      if(typeof subLev.id === 'number'){
       result.push({
         subjectId: subLev.subjectId,
         levelId: subLev.levelId,
         price: subLev.price
       });
      }else if (subLev.id && !isValidUUID(subLev.id)) {
        result.push({
          subjectId: subLev.subjectId,
          levelId: subLev.levelId,
          price: subLev.price
        });
      }else{
        result.push({
          id:subLev.id,
          levelId:subLev.levelId,
          subjectId:subLev.subjectId,
          price:subLev.price});
      }
    });

    return result;
  }


  function areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every(obj1 => arr2.some(obj2 => obj1.id === obj2.id)) &&
      arr2.every(obj1 => arr1.some(obj2 => obj1.id === obj2.id));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [forms, setForms] = useState<ITutorSubject[]>([]);

  useEffect(() => {
    const allValid = forms.every(form => form.subjectId && form.levelId && form.price);
    setBtnDisabled(!allValid);
  }, [forms]);



  const [nextId, setNextId] = useState(1);

  const handleAddForm = () => {
    setForms([...forms, { id: nextId, levelId: '', subjectId: '', price: ''}]);
    setNextId(prevState => prevState + 1);
  };

  const handleRemoveForm = (id:number|string) => {
    const updatedForms = forms.filter(form => form.id !== id);
    setForms(updatedForms);
  };

  const updateForm = (id:number | string, newValues:any) => {
    setForms(prevForms =>
      prevForms.map(form =>
        form.id === id
          ? {...form, ...newValues}
          : form
      )
    );
  };

  const [isLastForm, setIsLastForm] = useState(true);

  useEffect(() => {
    setIsLastForm(forms.length == 1);
  }, [forms]);

  return (
    <>
      <div>
        <div className='flex field__w-fit-content align--center flex--center'>
          <div className="flex flex--col flex--jc--center">
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
                <div
                  style={{ minWidth:'600px', overflowY: 'unset'}}
                  className="dash-wrapper dash-wrapper--adaptive flex--grow flex--col flex--jc--space-between" >
                  <div>


                  {forms.map((subject) =>(
                    <CreateSubjectCard
                      data={subject}
                      key={subject.id}
                      isLastForm={isLastForm}
                      updateForm={updateForm}
                      id={subject.id}
                      removeItem={() => handleRemoveForm(subject.id)}
                      handleGetData={() => getProfileData(tutorId ? tutorId : '')}/>
                  ))}
                  </div>
                  <div className="dash-wrapper__item w--100">
                    <div className="dash-wrapper__item__element dash-border" onClick={() => handleAddForm()}>

                      <div className="flex--primary cur--pointer flex-gap-10">
                          <div className="type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.ADD_NEW')}</div>
                          <i className="icon icon--base icon--plus icon--primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
          <div className="flex--center" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <button
              onClick={() => handleSubmit()}
              disabled={btnDisabled}
              className="btn btn--base btn--primary mt-4">
              {t('REGISTER.NEXT_BUTTON')}
            </button>
          </div>
      </div>
      </>
  );
};

export default SubjectsPage;
