import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { LevelCard } from './student_and_parent/LevelCard';
import { SubjectCard } from './student_and_parent/SubjectCard';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks';
import { setStepZero } from '../../../../slices/signUpSlice';
import ILevel from '../../../../interfaces/ILevel';
import atom from './student_and_parent/atom.png';
import bacteria from './student_and_parent/bacteria.png';
import croatia from './student_and_parent/croatia.png';
import enzyme from './student_and_parent/enzyme.png';
import germany from './student_and_parent/germany.png';
import math from './student_and_parent/math.png';
import unitedKingdom from './student_and_parent/united-kingdom.png';


interface Props{
  nextStep:() => void
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
  const [showSubjectCards, setShowSubjectCards] = useState(levelId !=='');

  async function handleNextStep(){
    if(stateLevelId && stateSubjectId){
      //TODO: set level and subject in state
      await dispatch(setStepZero(
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
      setTimeout(() => {
        setShowSubjectCards(true);
      }, 50); // a small delay
    }

    return () => {
      setAnimate(false);
    };
  }, [stateLevelId]);


  const levels:ILevel[] = [
    {
      id: "6324ece3-5cc4-48f3-8e9b-be757549eb35",
      abrv: "primary-school",
      name:"Primary School"
    },
    {
      id: "bb589332-eb38-4455-9259-1773bf88d60a",
      abrv: "high-school",
      name: "High School"
    },
    {
      id: "86211553-d94f-47b7-990b-67587f8c91bc",
      abrv:"university",
      name: "Iniversity"
    }
  ];

  const subjects = [
    {
      id: "8caedad0-55e5-4220-a7e7-f4aab4a3fbb8",
      name: "Physics",
      abrv:"physics",
      imgUrl: atom
    },
    {
      id: "2da9dfdb-e9cc-479a-802d-fa2a9b906575",
      name: "Maths",
      abrv: "maths",
      imgUrl:math
    },
    {
      id: "0cfe5ab2-843d-44d3-bee6-718097044e15",
      name: "English",
      abrv: "english",
      imgUrl:unitedKingdom
    },
    {
      id: "0fedd928-bdca-47de-b8c7-3becb6520996",
      name: "Chemistry",
      abrv: "chemistry",
      imgUrl: enzyme
    },
    {
      id: "5",
      name: "Croatian",
      abrv: "croatian",
      imgUrl:croatia
    },
    {
      id: "6",
      name: "German",
      abrv: "german",
      imgUrl:germany
    },
    {
      id: "7",
      name: "Biology",
      abrv: "biology",
      imgUrl:bacteria
    },
    {
      id: "9",
      name: "Biology",
      abrv: "biology",
      imgUrl:bacteria
    },


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
              level={level}
              isSelected={stateLevelId === level.id}
            />
          ))}
        </div>

        {/*<div className="mt-20"></div>*/}

        {showSubjectCards &&
          <div className={`${animate ? 'slide-in' : ''}`}>
            <div
              className={`subject-card-container mb-3`}
              style={{
                justifyContent:'center',
              }}
            >
              {subjects.map((subject) =>
                <SubjectCard
                  subject={subject}
                  key={subject.id}
                  isSelected={stateSubjectId === subject.id}
                  onClick={()=> setStateSubjectId(subject.id)}
                />
              )}
            </div>

            <span onClick={()=> alert('SIKE!! You thought')} className="cur--pointer change-color-hover--primary">{t('REGISTER.FORM.LOAD_MORE_SUBJECTS')}</span>
          </div>


        }



        <button
          disabled={buttonDisabled}
          className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup transition__05"
          onClick={handleNextStep}
        >{t('REGISTER.NEXT_BUTTON')}</button>
      </div>
    </>
  );
};
