import { Form, FormikProvider, useFormik } from 'formik';
import { debounce, isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select, { components, MenuProps } from 'react-select';

import IParams from '../../../interfaces/IParams';
import { useLazyGetLevelsQuery } from '../../../services/levelService';
import { useLazyGetSubjectsQuery } from '../../../services/subjectService';
import { useLazyGetAvailableTutorsQuery } from '../../../services/tutorService';
import CustomCheckbox from '../../components/form/CustomCheckbox';
import MySelect, { OptionType } from '../../components/form/MySelectField';
import MainWrapper from '../../components/MainWrapper';
import LoaderTutor from '../../components/skeleton-loaders/LoaderTutor';
import { SortDirection } from '../../lookups/sortDirection';
import getUrlParams from '../../utils/getUrlParams';
import PriceSort from './components/PriceSort';
import TutorItem from './components/TutorItem';
import ITutorItem from '../../../interfaces/ITutorItem';
import { useAppSelector } from '../../hooks';
import { useDispatch } from 'react-redux';
import {
  ISearchFiltersState,
  resetSearchFilters,
  setSearchFilters,
} from '../../../slices/searchFiltesSlice';
import {
  allActiveSubjects,
} from '../register/sign_up_rework/student_and_parent/subjects';
import { TutorItemMobile } from './components/TutorItemMobile';

interface Values {
  subject: string;
  level: string;
  dayOfWeek: string[];
  timeOfDay: string[];
}

const SearchTutors = () => {
  const [
    getAvailableTutors,
    {
      data: availableTutors,
      isLoading: isLoadingAvailableTutors,
      isUninitialized: availableTutorsUninitialized,
      isFetching: availableTutorsFetching,
    },
  ] = useLazyGetAvailableTutorsQuery();
  const [page, setPage] = useState<number>(1);
  const [getSubjects, {
    data: subjects,
    isLoading: isLoadingSubjects,
  }] = useLazyGetSubjectsQuery();
  const [getLevels, {
    data: levels,
    isLoading: isLoadingLevels,
  }] = useLazyGetLevelsQuery();
  const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
  const [levelOptions, setLevelOptions] = useState<OptionType[]>([]);

  const dispatch = useDispatch();
  const filtersState = useAppSelector((state) => state.searchFilters);
  const { subject, level, dayOfWeek, timeOfDay } = filtersState;

  const [params, setParams] = useState<IParams>({ rpp: 10, page: 0 });
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [dayOfWeekArray, setDayOfWeekArray] = useState<string[]>(dayOfWeek);
  const [timeOfDayArray, setTimeOfDayArray] = useState<string[]>(timeOfDay);
  const [loadedTutorItems, setLoadedTutorItems] = useState<ITutorItem[]>([]);
  const [priceSortDirection, setPriceSortDirection] = useState<SortDirection>(SortDirection.None);
  const [scrollTopOffset, setScrollTopOffset] = useState<number | null>(null);
  //initialSubject is not reset on initial level change
  const [isInitialSubject, setIsInitialSubject] = useState<boolean>(false);
  //storing subjects in state so it can reset on Reset Filter
  const [currentlyActiveId, setCurrentlyActiveId] = useState<string | undefined>();
  useEffect(() => {
    if (loadedTutorItems.length > 0) {
      setCurrentlyActiveId(loadedTutorItems[0].id);
    }
  }, [loadedTutorItems]);

  const history = useHistory();
  const { t } = useTranslation();
  const debouncedScrollHandler = debounce((e) => handleScroll(e), 300);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardElement = cardRef.current as HTMLDivElement;
  const levelDisabled = !levels || isLoadingLevels;
  const isLoading = isLoadingAvailableTutors || availableTutorsFetching; //|| availableTutorsUninitialized || availableTutorsFetching;
  const initialValues: Values = {
    subject: subject,
    level: level,
    dayOfWeek: dayOfWeek,
    timeOfDay: timeOfDay,
  };

  const handleAvailabilityChange = () => {
    const initialParamsObj: IParams = { ...params };
    const paramsObj: IParams = { ...params };

    if (formik.values.dayOfWeek.length !== 0) {
      const dayOfWeekString = formik.values.dayOfWeek.toString();
      paramsObj.dayOfWeek = dayOfWeekString;
    } else {
      delete paramsObj.dayOfWeek;
    }
    if (formik.values.timeOfDay.length !== 0) {
      const timeOfDayString = formik.values.timeOfDay.toString();
      paramsObj.timeOfDay = timeOfDayString;
    } else {
      delete paramsObj.timeOfDay;
    }

    if (!isEqual(initialParamsObj, paramsObj)) {
      setParams(paramsObj);
    }
  };

  const CustomMenu = (props: MenuProps) => {
    return (
      <components.Menu
        className='react-select--availability availability-filter-width' {...props}>
        <div className='align--center'>
          <div
            className='type--uppercase type--color--tertiary mb-4 '>{t('SEARCH_TUTORS.TUTOR_AVAILABLE')}</div>

          <div className='availability-container-time'>
            <CustomCheckbox
              id='beforeNoon'
              customChecks={timeOfDayArray}
              label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.BEFORE_NOON')}
              handleCustomCheck={handleCustomTimeOfDay}
            />
            <CustomCheckbox
              customChecks={timeOfDayArray}
              id='noonToFive'
              label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.NOON_TO_FIVE')}
              handleCustomCheck={handleCustomTimeOfDay}
            />
            <CustomCheckbox
              customChecks={timeOfDayArray}
              id='afterFive'
              label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.AFTER_FIVE')}
              handleCustomCheck={handleCustomTimeOfDay}
            />
          </div>
          <div className='mt-6'>
            <div
              className='type--uppercase type--color--tertiary mb-4'>{t('SEARCH_TUTORS.TUTOR_AVAILABLE')}</div>
            <div className='availability-container'>
              <CustomCheckbox
                id='mon'
                customChecks={dayOfWeekArray}
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.MON')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='tue'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.TUE')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='wed'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.WED')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='thu'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.THU')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='fri'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.FRI')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='sat'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SAT')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
              <CustomCheckbox
                customChecks={dayOfWeekArray}
                id='sun'
                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SUN')}
                handleCustomCheck={(id: string) => {
                  handleCustomDayOfWeek(id);
                }}
              />
            </div>
          </div>
        </div>
      </components.Menu>
    );
  };

  const handleCustomDayOfWeek = (id: string) => {
    const ifExist = dayOfWeekArray.find((item) => item === id);

    if (ifExist) {
      const filteredList = dayOfWeekArray.filter((item) => item !== id);
      setDayOfWeekArray(filteredList);
    } else {
      setDayOfWeekArray([...dayOfWeekArray, id]);
    }
  };

  const handleCustomTimeOfDay = (id: string) => {
    const ifExist = timeOfDayArray.find((item) => item === id);

    if (ifExist) {
      const filteredList = timeOfDayArray.filter((item) => item !== id);
      setTimeOfDayArray(filteredList);
    } else {
      setTimeOfDayArray([...timeOfDayArray, id]);
    }
  };

  const fetchData = async () => {
    const urlQueries: IParams = getUrlParams(history.location.search.replace('?', ''));

    if (Object.keys(urlQueries).length > 0) {
      urlQueries.subject && (await formik.setFieldValue('subject', urlQueries.subject)) && setIsInitialSubject(true);
      urlQueries.level && (await formik.setFieldValue('level', urlQueries.level));
      urlQueries.dayOfWeek && setDayOfWeekArray(urlQueries.dayOfWeek.split(','));
      urlQueries.timeOfDay && setTimeOfDayArray(urlQueries.timeOfDay.split(','));

      setParams(urlQueries);

      //set sort direction if params.price is already in URL
      if (urlQueries.sort) {
        setPriceSortDirection(urlQueries.sort as SortDirection);
      }

      urlQueries.subject = formik.values.subject;
      urlQueries.level = formik.values.level;
      urlQueries.timeOfDay = formik.values.timeOfDay.join(',');
      urlQueries.dayOfWeek = formik.values.dayOfWeek.join(',');

      const tutorResponse = await getAvailableTutors({ ...urlQueries }).unwrap();
      setLoadedTutorItems(tutorResponse.content);
    } else {
      params.subject = formik.values.subject;
      params.level = formik.values.level;
      params.timeOfDay = formik.values.timeOfDay.join(',');
      params.dayOfWeek = formik.values.dayOfWeek.join(',');
      const tutorResponse = await getAvailableTutors(params).unwrap();
      setLoadedTutorItems(tutorResponse.content);
    }

    setInitialLoad(false);
  };

  const fetchFilteredData = async () => {
    const filterParams = new URLSearchParams();
    if (Object.keys(params).length !== 0 && params.constructor === Object) {
      for (const [key, value] of Object.entries(params)) {
        filterParams.append(key, value);
      }
      history.push({ search: filterParams.toString() });
    } else {
      history.push({ search: filterParams.toString() });
    }

    const filters: ISearchFiltersState = {
      subject: formik.values.subject,
      level: formik.values.level,
      dayOfWeek: formik.values.dayOfWeek,
      timeOfDay: formik.values.timeOfDay,
    };

    dispatch(setSearchFilters(filters));

    params.subject = filters.subject;
    params.level = filters.level;
    params.timeOfDay = filters.timeOfDay.join(',');
    params.dayOfWeek = filters.dayOfWeek.join(',');

    const tutorResponse = await getAvailableTutors({ ...params }).unwrap();
    setLoadedTutorItems(tutorResponse.content);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    const newParams = { ...params };
    newParams.page = page;
    setParams(newParams);
  };

  const hideLoadMore = () => {
    let returnValue: boolean = false;
    if (availableTutors) {
      //const totalPages = Math.ceil(notificationsData.count / params.size);
      if (availableTutors.last) returnValue = true;
    }
    return returnValue;
  };

  const handleScroll = async (e: HTMLDivElement) => {
    if (availableTutors && loadedTutorItems.length != availableTutors.totalElements) {
      const innerHeight = e.scrollHeight;
      const scrollPosition = e.scrollTop + e.clientHeight;

      const roundedInnerHeight = Math.floor(innerHeight);
      const roundedScrollPosition = Math.floor(scrollPosition);

      // if (roundedInnerHeight === roundedScrollPosition) {
      if (roundedScrollPosition / roundedInnerHeight > 0.8) {
        // handleLoadMore();
        if (!availableTutors.last) {
          const tutorResponse = await getAvailableTutors({
            ...params,
            page: availableTutors.number + 1,
          }).unwrap();
          setLoadedTutorItems((prevItems) => [...prevItems, ...tutorResponse.content]);
          setScrollTopOffset(scrollPosition);
        }
      }
    }
  };

  const emptyValues: Values = {
    subject: '',
    level: '',
    dayOfWeek: [],
    timeOfDay: [],
  };

  const [resetKey, setResetKey] = useState(false);
  const handleResetFilter = () => {
    //can't delete all params because reset button couldn't affect price sort
    const paramsObj = { ...params };
    delete paramsObj.dayOfWeek;
    delete paramsObj.level;
    delete paramsObj.subject;
    delete paramsObj.timeOfDay;
    setParams(paramsObj);

    setResetKey((prevKey) => !prevKey); // this is used to reset select subject and select lvl components
    setDayOfWeekArray([]);
    setTimeOfDayArray([]);

    dispatch(resetSearchFilters());
    formik.setValues(emptyValues);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      //no submit
    },
  });

  const resetFilterDisabled =
    formik.values.level == '' && formik.values.subject == '' && formik.values.dayOfWeek.length == 0 && formik.values.timeOfDay.length == 0;

  useEffect(() => {
    if (priceSortDirection === SortDirection.None) {
      if (Object.keys(params).length > 0) {
        const paramsObj = { ...params };
        delete paramsObj.sort;
        setParams({ ...paramsObj });
      }
    } else {
      if (params.sort) {
        const paramsObj = { ...params };
        delete paramsObj.sort;
        setParams({ ...paramsObj, sort: 'price,' + priceSortDirection });
      } else {
        setParams({ ...params, sort: 'price,' + priceSortDirection });
      }
    }
  }, [priceSortDirection]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    //setScrollTopOffset(null);
    if (!initialLoad) {
      const filters: ISearchFiltersState = {
        subject: formik.values.subject,
        level: formik.values.level,
        dayOfWeek: formik.values.dayOfWeek,
        timeOfDay: formik.values.timeOfDay,
      };

      dispatch(setSearchFilters(filters));

      fetchFilteredData();
    }
  }, [params]);

  useEffect(() => {
    if (cardElement && scrollTopOffset) {
      // cardElement.scrollTop = scrollTopOffset;
    }
  }, [loadedTutorItems]);

  useEffect(() => {
    getLevels();
    getSubjects();
    setTitle();
  }, []);

  useEffect(() => {
    setTitle();
  }, [formik.values.subject, subjects, subjectOptions]);

  function setTitle() {
    const subj = formik.getFieldProps('subject');
    if (subjects && subj.value) {
      const name = allActiveSubjects.filter((item) => item.id === subj.value)[0]; // TODO: remeber to uncomment active subjs later
      document.title = t('SEO_TITLE.TUTOR_SEARCH').replaceAll(':subject', t('SUBJECTS_GENITIVE.' + name?.abrv.trim().toLowerCase()));
    } else document.title = 'Teorem';
  }

  useEffect(() => {
    if (levels) {
      setLevelOptions(levels);
    }
  }, [levels]);

  useEffect(() => {
    if (subjects) {
      setSubjectOptions(subjects);
    }
  }, [subjects]);

  useEffect(() => {
    if (levels) {
      setLevelOptions(levels);
    }
  }, []);

  useEffect(() => {
    if (formik.values.subject) {
      setParams({ ...params, subject: formik.values.subject });
    }
  }, [formik.values.subject]);

  useEffect(() => {
    if (formik.values.level) {
      setParams({ ...params, level: formik.values.level });
    }
  }, [formik.values.level]);

  useEffect(() => {
    formik.setFieldValue('dayOfWeek', dayOfWeekArray);
  }, [dayOfWeekArray]);

  useEffect(() => {
    formik.setFieldValue('timeOfDay', timeOfDayArray);
  }, [timeOfDayArray]);

  useEffect(() => {
    handleAvailabilityChange();
  }, [formik.values.timeOfDay]);

  useEffect(() => {
    handleAvailabilityChange();
  }, [formik.values.dayOfWeek]);

  const isMobile = window.innerWidth < 1200;
  return (
    <MainWrapper>
      <div onScroll={(e) => debouncedScrollHandler(e.target)}
           className='card--secondary' ref={cardRef}>
        <div
          className='card--secondary__head card--secondary__head--search-tutor'>
          <div
            className='type--lg type--wgt--bold mb-4 mb-xl-0'>{t('SEARCH_TUTORS.TITLE')}</div>
          <div className='flex flex--wrap flex--center'>
            <FormikProvider value={formik}>
              <Form
                className='flex flex--wrap flex--jc--center filters-container'
                noValidate>
                <MySelect
                  key={`level-select-${resetKey}`}
                  field={formik.getFieldProps('level')}
                  form={formik}
                  meta={formik.getFieldMeta('level')}
                  classNamePrefix='react-select--search-tutor'
                  isMulti={false}
                  options={levelOptions}
                  isDisabled={levelDisabled}
                  placeholder={t('SEARCH_TUTORS.PLACEHOLDER.LEVEL')}
                ></MySelect>
                <MySelect
                  key={`subject-select-${resetKey}`}
                  field={formik.getFieldProps('subject')}
                  form={formik}
                  meta={formik.getFieldMeta('subject')}
                  isMulti={false}
                  className=''
                  classNamePrefix='pos--r--0-mobile react-select--search-tutor'
                  options={subjectOptions}
                  isDisabled={levelDisabled || isLoadingSubjects}
                  noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                  placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                ></MySelect>
                <Select
                  placeholder={t('SEARCH_TUTORS.PLACEHOLDER.AVAILABILITY')}
                  components={{
                    Menu: CustomMenu,
                  }}
                  className=' react-select--search-tutor--menu'
                  classNamePrefix='react-select--search-tutor'
                  //onMenuClose={handleMenuClose}
                  isSearchable={false}
                ></Select>
              </Form>
            </FormikProvider>
            <button className='btn btn--clear align--center mt-2'
                    onClick={handleResetFilter} disabled={resetFilterDisabled}>
              {t('SEARCH_TUTORS.RESET_FILTER')}
            </button>
          </div>
        </div>
        <div className='card--secondary__body'>
          <div className='mb-10 flex--primary'>
            <div>
              <span
                className='type--uppercase type--color--tertiary'>{t('SEARCH_TUTORS.TUTOR_AVAILABLE')}</span>
              <span
                className='tag--primary d--ib ml-2'>{availableTutors ? availableTutors.totalElements : '0'}</span>
            </div>
            <PriceSort
              sortDirection={priceSortDirection}
              handleActiveSort={(sortDirection: SortDirection) => setPriceSortDirection(sortDirection)}
            />
          </div>

          <div className='tutor-list'>
            {loadedTutorItems.length > 0 ? (
              loadedTutorItems.map((tutor) =>
                isMobile ? (
                  <TutorItemMobile key={tutor.id} tutor={tutor} />
                ) : (
                  <TutorItem
                    setActiveCard={setCurrentlyActiveId}
                    currentlyActive={currentlyActiveId ? tutor.id === currentlyActiveId : false}
                    key={tutor.id}
                    tutor={tutor}
                  />
                ),
              )
            ) : isLoading ? (
              <>
                <LoaderTutor />
                <LoaderTutor />
                <LoaderTutor />
              </>
            ) : (
              <div className='tutor-list__no-results'>
                <h1
                  className='tutor-list__no-results__title'>{t('SEARCH_TUTORS.NO_RESULT.TITLE')}</h1>
                <p
                  className='tutor-list__no-results__subtitle'>{t('SEARCH_TUTORS.NO_RESULT.DESC')}</p>
                <button className='btn btn--clear ml-6 type--wgt--bold'
                        onClick={handleResetFilter}
                        disabled={resetFilterDisabled}>
                  {t('SEARCH_TUTORS.RESET_FILTER')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default SearchTutors;
