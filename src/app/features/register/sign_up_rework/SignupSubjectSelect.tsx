import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { LevelCard } from './student_and_parent/LevelCard';
import { SubjectCard } from './student_and_parent/SubjectCard';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks';
import { setStepZero } from '../../../../slices/signUpSlice';
import { RoleSelectionEnum } from '../../../constants/roleSelectionOptions';

interface Props{
  nextStep:() => void
}

interface Level{
  id: string,
  name: string
}


export const SignupSubjectSelect = (props:Props) => {
  const {nextStep} = props;
  const dispatch = useDispatch();
  const state = useAppSelector((state) => state.signUp);
  const { levelId, subjectId } = state;

  const [stateLevelId, setStateLevelId] = useState<string>(levelId);
  const [stateSubjectId, setStateSubjectId] = useState(subjectId);
  const [animate, setAnimate] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);


  function handleNextStep(){
    if(stateLevelId && stateSubjectId){
      //TODO: set level and subject in state
      dispatch(setStepZero(
        {
          levelId: stateLevelId,
          subjectId: stateSubjectId
        }
      ));
      nextStep();
    }
  }

  useEffect(() => {
    if(stateLevelId && stateSubjectId){
      setButtonDisabled(false);
    }else{
      setButtonDisabled(true);
    }
  }, [stateLevelId,stateSubjectId]);

  //animation
  useEffect(() => {
    if (stateLevelId && !subjectId) {
      setAnimate(true);
    }

    return () => {
      setAnimate(false);
    };
  }, [stateLevelId]);

  const levels:Level[] = [
    {
      id: "1",
      name: "elementary school"
    },
    {
      id: "2",
      name: "high school"
    },
    {
      id: "3",
      name: "university"
    }
    // ,
    // {
    //   id: "4",
    //   name: "matura prep"
    // }
  ];

  const subjects = [
    {
      id: "1",
      name: "Matematika",
      imgUrl: 'url'
    },
    {
      id: "2",
      name: "Fizika",
      imgUrl:"imgurl"
    },
    {
      id: "3",
      name: "Engleski",
      imgUrl:"imgurl"
    },
    {
      id: "4",
      name: "Matematika",
      imgUrl: 'url'
    },
    {
      id: "5",
      name: "Fizika",
      imgUrl:"imgurl"
    }
    // ,
    // {
    //   id: "6",
    //   name: "Engleski",
    //   imgUrl:"imgurl"
    // },

  ];

  return (
    <>
      <div className="signup-subject-container flex flex--center flex--col align--center sign-up-form-wrapper">

        <div className="flex--row level-card-container mb-10"
        style={{gap:'10px',width:'100%'}}>
          {levels.map((level) => (
            <LevelCard
              onClick={() => setStateLevelId(level.id)}
              key={level.id}
              id={level.id}
              name={level.name}
              isSelected={stateLevelId === level.id}
            />
          ))}
        </div>

        {/*<div className="mt-20"></div>*/}

        {stateLevelId &&
          <div
            className={`subject-card-container ${animate ? 'slide-in' : ''}`}
            style={{
              gap:'10px',
              justifyContent:'center'
            }}
          >
            {subjects.map((subject) =>
              <SubjectCard
                key={subject.id}
                name={subject.name}
                imgUrl={subject.imgUrl}
                isSelected={stateSubjectId === subject.id}
                onClick={()=> setStateSubjectId(subject.id)}
              />
            )}

          </div>}

        {stateLevelId &&
          <span onClick={()=> alert('SIKE!! You thought')} className="mt-5 cur--pointer">Učitaj vise predmeta...</span>
        }

        <button
          disabled={buttonDisabled}
          className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup"
          onClick={handleNextStep}
        >{t('REGISTER.NEXT_BUTTON')}</button>
      </div>
    </>
  );
};
