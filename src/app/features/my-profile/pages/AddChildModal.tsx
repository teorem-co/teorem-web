import moment from 'moment';
import { useEffect, useState } from 'react';
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

interface Props {
  toggleModal: (newValue: boolean) => void;
}

const AddChildModal = (props:Props) => {
  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getChildren, { data: childrenData, isLoading: childrenLoading, isUninitialized: childrenUninitialized }] = useLazyGetChildrenQuery();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [childForEdit, setChildForEdit] = useState<IChild | null>(null);

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
  }, []);

  const closeModal = () => {
    props.toggleModal(false);
  };

  return (
    <>
      <div className="card--profile">
        {/* HEADER */}
        <div style={{margin: "40px"}} className="flex">
          <div className="flex flex--center flex--shrink w--105">
            <CircularProgress progressNumber={50} size={80}  />
          </div>
          <div className="flex flex--col flex--jc--center ml-6">
            <div className="type--md mb-2">{t('COMPLETE_PROFILE.TITLE')}</div>
            <div className="type--color--tertiary w--200--max">{t('COMPLETE_PROFILE.DESCRIPTION')}</div>
          </div>
        </div>
        {(isLoading && <LoaderPrimary />) || (
          <div className="card--profile__section">
            <div>
              <div className="dash-wrapper dash-wrapper--adaptive">
                <div
                  className="dash-wrapper__item"
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
                      <div className="dash-wrapper__item" key={x.username} onClick={() => handleEditChild(x)}>
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
        <button onClick={closeModal} className="btn btn--base btn--ghost" style={{margin: "20px", float: "right"}}>
          {t('SKIP_FOR_NOW')}
        </button>
      </div>
      <AddChildSidebar closeSidebar={closeAddCardSidebar} sideBarIsOpen={addSidebarOpen} childData={childForEdit} />
    </>
  );
};

export default AddChildModal;
