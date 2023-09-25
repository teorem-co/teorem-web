import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IChild } from '../../../../interfaces/IChild';
import {
  useLazyGetProfileProgressQuery,
} from '../../../../services/tutorService';
import { useLazyGetChildrenQuery } from '../../../../services/userService';
import ImageCircle from '../../../components/ImageCircle';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import AddChildSidebar from '../components/AddChildSidebar';
import { setMyProfileProgress } from '../slices/myProfileSlice';
import CircularProgress from "../components/CircularProgress";
import {t} from "i18next";
import {Link} from "react-router-dom";

interface Props {
  toggleModal: (newValue: boolean) => void;
  setChildless: (childless: boolean) => void;
}

const AddChildModal = (props:Props) => {
  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getChildren, { data: childrenData, isLoading: childrenLoading, isUninitialized: childrenUninitialized }] = useLazyGetChildrenQuery();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [childForEdit, setChildForEdit] = useState<IChild | null>(null);
  const [childlessButton, setChildlessButton] = useState(true);

  const { t } = useTranslation();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);
  const dispatch = useAppDispatch();
  const isLoading = childrenLoading || childrenUninitialized;

  const closeAddCardSidebar = () => {
    setAddSidebarOpen(false);
  };

  const fetchProgress = async () => {
    //If there is no state in redux for profileProgress fetch data and save result to redux
    if (profileProgressState.percentage === 0) {
      const progressResponse = await getProfileProgress().unwrap();
      dispatch(setMyProfileProgress(progressResponse));
    }
  };

  const fetchData = async () => {
    if(userId){
      await getChildren(userId).unwrap();
    }
  };

  const handleAddNewchild = () => {
    setChildForEdit(null);
    setAddSidebarOpen(true);
  };

  const handleEditChild = (x: IChild) => {
    const childObj: IChild = {
      firstName: x.firstName,
      username: x.username,
      dateOfBirth: x.dateOfBirth,
      password: x.password,
      lastName: x.lastName,
      id: x.id,
    };
    setChildForEdit(childObj);
    setAddSidebarOpen(true);
  };

  useEffect(() => {
    fetchProgress();
    fetchData();
    if(childrenData?.length === 0) {
      setChildlessButton(false);
    } else {
      setChildlessButton(true);
    }
  }, []);

  const closeModal = () => {
    props.toggleModal(false);
    props.setChildless(false);
    console.log("modal");
  };

  return (
    <>
      <div>
        {/* HEADER */}
        <div style={{margin: "40px"}} className="flex">
          <div className="flex flex--center flex--shrink w--105">
            <CircularProgress
              className='progress-circle ml-1'
              progressNumber={50}
            />
          </div>
          <div className="flex flex--col flex--jc--center ml-6">
            <h4 className='signup-title ml-6 text-align--center'>{t('ADD_CHILD.PART_1')} <span className='primary-color'>{t('ADD_CHILD.PART_2')}</span></h4>
          </div>
        </div>
        {(isLoading && <LoaderPrimary />) || (
          <div className="card--profile__section">
            <div>
              <div className="dash-wrapper dash-wrapper--adaptive">
                <div
                  className="dash-wrapper__item"
                  style={{width: "95%"}}
                  onClick={() => {
                    handleAddNewchild();
                  }}
                >
                  <div className="dash-wrapper__item__element">
                    <div className="flex--primary cur--pointer">
                      <div>
                        <div className="mb-1">{t('ADD_CHILD.TITLE')}</div>
                        <div className="type--color--secondary">{t('ADD_CHILD.DESCRIPTION')}</div>
                      </div>
                      <i className="icon icon--base icon--plus icon--primary"></i>
                    </div>
                  </div>
                </div>
                {childrenData &&
                  childrenData.map((x: IChild) => {
                    return (
                      <div className="dash-wrapper__item" key={x.username} style={{width: "100%"}} onClick={() => handleEditChild(x)}>
                        <div className="dash-wrapper__item__element">
                          <div className="flex--primary cur--pointer">
                            <div className="flex flex--center">
                              <ImageCircle initials={`${x.firstName.charAt(0)}`} />
                              <div className="flex--grow ml-4">
                                <div className="mb-1">{x.firstName}</div>
                                <div className="type--color--secondary">
                                  {moment(x.dateOfBirth).format('MM/DD/YYYY')}
                                </div>
                              </div>
                            </div>
                            <i className="icon icon--base icon--edit icon--primary"></i>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        <Link to={closeModal} style={{margin: "0 auto", display: "flex",
          justifyContent: "left", marginBottom: "10px", marginTop: "-25px"}}>{t('SKIP_FOR_NOW')}</Link>
        <button disabled={childlessButton} onClick={closeModal} className="btn btn--base btn--primary" style={{margin: "0 auto", display: "flex",
          justifyContent: "center"}}>
          {t('REGISTER.NEXT_BUTTON')}
        </button>
      </div>
      <AddChildSidebar closeSidebar={closeAddCardSidebar} sideBarIsOpen={addSidebarOpen} childData={childForEdit} />
    </>
  );
};

export default AddChildModal;

