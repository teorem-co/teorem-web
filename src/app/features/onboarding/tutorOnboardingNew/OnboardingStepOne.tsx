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

const OnboardingStepOne = () => {
  //const { data: profileProgress } = useGetProfileProgressQuery();
  const [getTutorAvailability, { data: tutorAvailability, isUninitialized: availabilityUninitialized, isLoading: availabilityLoading }] =
    useLazyGetTutorAvailabilityQuery();
  const [updateTutorAvailability] = useUpdateTutorAvailabilityMutation();
  const [createTutorAvailability] = useCreateTutorAvailabilityMutation();
  const [getProfileProgress] = useLazyGetProfileProgressQuery();

  const [currentAvailabilities, setCurrentAvailabilities] = useState<(string | boolean)[][]>([]);
  const [saveBtnActive, setSaveBtnActive] = useState(false);

  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const loading = availabilityUninitialized || availabilityLoading;

  const renderTableCells = (column: string | boolean, availabilityIndex: IAvailabilityIndex) => {

    if (typeof column === 'boolean') {
      return (
        <td
          className={`${column ? 'table--availability--check' : 'table--availability--close'}`}
          onClick={() => handleAvailabilityClick(availabilityIndex.column, availabilityIndex.row, column)}
          key={availabilityIndex.column}
        >
          <i className={`icon icon--base ${column ? 'icon--check icon--primary' : 'icon--close icon--grey'} `}></i>
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
      //await updateTutorAvailability({ tutorAvailability: toSend });
      const tutorId = getUserId();
      await updateTutorAvailability({ tutorId: tutorId ? tutorId : '', tutorAvailability: toSend });
      const progressResponse = await getProfileProgress().unwrap();
      dispatch(setMyProfileProgress(progressResponse));
      toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.UPDATED'));
    } else {
      await createTutorAvailability({ tutorAvailability: toSend });
      const progressResponse = await getProfileProgress().unwrap();
      dispatch(setMyProfileProgress(progressResponse));
      toastService.success(t('MY_PROFILE.GENERAL_AVAILABILITY.CREATED'));
    }


  };

  const handleUpdateOnRouteChange = () => {
    handleSubmit();
    return true;
  };

  const fetchData = async () => {
    if (userId) {
      const tutorAvailabilityResponse = await getTutorAvailability(userId).unwrap();
      setCurrentAvailabilities(tutorAvailabilityResponse);

      //If there is no state in redux for profileProgress fetch data and save result to redux
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
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
      <RouterPrompt
        when={saveBtnActive}
        onOK={handleUpdateOnRouteChange}
        onCancel={() => {
          //if you pass "false" router will be blocked and you will stay on the current page
          return true;
        }}
      />
      <div>
        <img
          src={logo}
          alt='logo'
          className="mt-5 ml-5 signup-logo"
        />
        <div className='flex field__w-fit-content align--center flex--center'>
          <div>
            {/* HEADER */}
            <div style={{margin: "40px"}} className="flex">
              <div className="flex flex--center flex--shrink w--105">
                <CircularProgress progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0} size={80}  />
              </div>
              <div className="flex flex--col flex--jc--center ml-6">
                <h4 className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.GENERAL_AVAILABILITY.TITLE')}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* AVAILABILITY */}
        {(loading && <LoaderPrimary />) || (
          <div className="flex--center" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <table className="table table--availability"><tbody>{renderAvailabilityTable()}</tbody></table>
            <button onClick={() => handleSubmit()} className="btn btn--base btn--primary mt-4">
              {t('REGISTER.NEXT_BUTTON')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OnboardingStepOne;
