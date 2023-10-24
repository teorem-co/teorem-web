import { t } from 'i18next';
import { cloneDeep, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';

import {
  useLazyGetProfileProgressQuery,
} from '../../../../services/tutorService';
import RouterPrompt from '../../../components/RouterPrompt';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import availabilityTable from '../../../constants/availabilityTable';
import toastService from '../../../services/toastService';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import {
  useCreateTutorAvailabilityMutation,
  useLazyGetTutorAvailabilityQuery, useUpdateTutorAvailabilityMutation
} from "../../my-profile/services/tutorAvailabilityService";
import IAvailabilityIndex from "../../my-profile/interfaces/IAvailabilityIndex";
import ITutorAvailability from "../../my-profile/interfaces/ITutorAvailability";
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import CircularProgress from "../../my-profile/components/CircularProgress";
import logo from "../../../../assets/images/teorem_logo_purple.png";
import {useHistory} from "react-router";
import {PATHS} from "../../../routes";
import SearchTutors from "../../searchTutors/SearchTutors";
import {useDispatch} from "react-redux";
import {setStepZero} from "../../../../slices/onboardingSlice";

interface AvailabilityValues {
  availability: ITutorAvailability[];
}

type AvailabilityProps ={
  nextStep:() => void
};


const AvailabilityPage = ({ nextStep }:AvailabilityProps) => {
  // const { data: profileProgress } = useGetProfileProgressQuery();
  const [getTutorAvailability, { data: tutorAvailability, isUninitialized: availabilityUninitialized, isLoading: availabilityLoading }] =
    useLazyGetTutorAvailabilityQuery();
  const [updateTutorAvailability] = useUpdateTutorAvailabilityMutation();
  const [createTutorAvailability] = useCreateTutorAvailabilityMutation();
  const [getProfileProgress] = useLazyGetProfileProgressQuery();

  const [currentAvailabilities, setCurrentAvailabilities] = useState<(string | boolean)[][]>([]);
  const [saveBtnActive, setSaveBtnActive] = useState(false);

  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const [progressPercentage, setProgressPercentage] = useState(profileProgressState.percentage);

  const userId = useAppSelector((state) => state.auth.user?.id);
  const loading = availabilityUninitialized || availabilityLoading;
  const history = useHistory();

  const store = useAppSelector((store) => store.onboarding);
  const{availability} = store;

  const initialValues: AvailabilityValues = {
    availability: availability,
  };

  const isMobile = window.innerWidth < 765;
  const renderTableCells = (column: string | boolean, availabilityIndex: IAvailabilityIndex) => {

    if (typeof column === 'boolean') {
      return (
        <td
          className={`${column ? 'table--availability--check' : 'table--availability--close'}`}
          onClick={() => handleAvailabilityClick(availabilityIndex.column, availabilityIndex.row, column)}
          key={availabilityIndex.column}
        >
          <i className={`icon ${isMobile ? 'icon--sm' : 'icon--base'} ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
        </td>
      );
    } else if (column == '') {
      return <td key={availabilityIndex.column}></td>;
    } else if (column == 'Pre 12 pm') {
      return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.PRE12`)}</td>;
    } else if (column == '12 - 5 pm') {
      return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.ON12`)}</td>;
    } else if (column == 'After 5 pm') {
      return <td key={availabilityIndex.column}>{t(`TUTOR_PROFILE.AFTER5`)}</td>;
    }
    else {
      return <td key={availabilityIndex.column}>{t(`CONSTANTS.DAYS_SHORT.${column.toUpperCase()}`)}</td>;
    }
  };

  const renderAvailabilityTable = () => {
    const update: boolean = currentAvailabilities.length > 0 && currentAvailabilities[1].length > 1;

    const availabilityToMap = update ? currentAvailabilities : currentAvailabilities;

    return availabilityToMap.map((row: (string | boolean)[], rowIndex: number) => {
      return (
        <tr key={rowIndex}>
          {row.map((column: string | boolean, columnIndex: number) => {
            const availabilityIndex: IAvailabilityIndex = {
              row: rowIndex,
              column: columnIndex,
            };
            return renderTableCells(column, availabilityIndex);
          })}
        </tr>
      );
    });
  };

  const handleAvailabilityClick = (column: number, row: number, value: boolean) => {
    let cloneState;
    if (currentAvailabilities && currentAvailabilities[1].length > 1) {
      cloneState = cloneDeep(currentAvailabilities);
    } else {
      cloneState = cloneDeep(availabilityTable);
    }

    cloneState[row][column] = !value;

    setCurrentAvailabilities(cloneState);
  };

  const handleSubmit = async () => {
    const toSend: ITutorAvailability[] = [];

    for (let i = 1; i < 8; i++) {
      const obj: any = {};
      const currentDayOfWeek = currentAvailabilities[0][i];
      let lowerCaseDayOfWeek = '';
      if (typeof currentDayOfWeek === 'string') {
        lowerCaseDayOfWeek = currentDayOfWeek.toLowerCase();
      }

      obj.dayOfWeek = lowerCaseDayOfWeek;
      obj.beforeNoon = currentAvailabilities[1][i];
      obj.noonToFive = currentAvailabilities[2][i];
      obj.afterFive = currentAvailabilities[3][i];
      toSend.push(obj);
    }

    if (tutorAvailability && tutorAvailability[1].length > 1) {
      const tutorId = getUserId();
      await updateTutorAvailability({ tutorId: tutorId ? tutorId : '', tutorAvailability: toSend });
      const progressResponse = await getProfileProgress().unwrap();
      setProgressPercentage(progressResponse.percentage);
      await dispatch(setMyProfileProgress(progressResponse));
    } else {
      await createTutorAvailability({ tutorAvailability: toSend });
      const progressResponse = await getProfileProgress().unwrap();
      setProgressPercentage(progressResponse.percentage);
      await dispatch(setMyProfileProgress(progressResponse));
    }
    dispatch(setStepZero({
      availability: toSend
    }));
    nextStep();
  };

  const handleUpdateOnRouteChange = () => {
    handleSubmit();
    return true;
  };

  const fetchData = async () => {
    if (userId) {
      const tutorAvailabilityResponse = await getTutorAvailability(userId).unwrap();
      setCurrentAvailabilities(tutorAvailabilityResponse);

      const progressResponse = await getProfileProgress().unwrap();
      setProgressPercentage(progressResponse.percentage);
      dispatch(setMyProfileProgress(progressResponse));
      //If there is no state in redux for profileProgress fetch data and save result to redux
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
        setProgressPercentage(progressResponse.percentage);
        dispatch(setMyProfileProgress(progressResponse));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const isLoaded: boolean = tutorAvailability && tutorAvailability.length > 0 && currentAvailabilities.length > 0 ? true : false;

    if (isLoaded) {
      if (isEqual(tutorAvailability, currentAvailabilities)) {
        setSaveBtnActive(false);
      } else {
        setSaveBtnActive(true);
      }

      if(currentAvailabilities.toString().includes("true")) {
        setSaveBtnActive(true);
      } else {
        setSaveBtnActive(false);
      }
    }
  }, [currentAvailabilities]);

  //set state to updated tutorAvailabilities for RouterPrompt modal check
  useEffect(() => {
    if (tutorAvailability) {
      setCurrentAvailabilities(tutorAvailability);
    }
  }, [tutorAvailability]);

  return (
    <>
      {/*<RouterPrompt*/}
      {/*  when={saveBtnActive}*/}
      {/*  onOK={handleUpdateOnRouteChange}*/}
      {/*  onCancel={() => {*/}
      {/*    //if you pass "false" router will be blocked and you will stay on the current page*/}
      {/*    return true;*/}
      {/*  }}*/}
      {/*/>*/}
      <div>
        <div className='flex field__w-fit-content align--center flex--center'>
            <div className="flex flex--col flex--jc--center">
              <div>
                <p className='ml-6 text-align--center' style={{fontSize: "medium"}}>{t('TUTOR_ONBOARDING.TITLE')}</p>
                <p className='ml-6 text-align--center' style={{fontSize: "small"}}>{t('TUTOR_ONBOARDING.SUBTITLE')}</p>
              </div>
              <div style={{margin: "40px"}} className="flex flex--row flex--jc--center">
                <div className="flex flex--center flex--shrink ">
                  {/*<CircularProgress progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0} size={80}  />*/}
                  <CircularProgress progressNumber={progressPercentage} size={isMobile ? 65 : 80}  />
                </div>
                <div className="flex flex--col flex--jc--center">
                  <h4 className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</h4>
                </div>
              </div>
            </div>
        </div>
        {(loading && <LoaderPrimary />) || (
          <div className="flex--center m-2" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <table className="table table--availability "><tbody>{renderAvailabilityTable()}</tbody></table>
            <div className="type--sm align--center field__w-fit-content p-2">
              <span>{t('TUTOR_ONBOARDING.TOOLTIPS.AVAILABILITY')}</span>
            </div>
            <button
              id="tutor-onboarding-step-1"
              onClick={() => handleSubmit()} className="btn btn--lg btn--primary mt-4" disabled={!saveBtnActive}>
              {t('REGISTER.NEXT_BUTTON')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AvailabilityPage;
