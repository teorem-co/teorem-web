import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  matchPath,
  NavLink,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';

import languageOptions from './constants/languageOptions';
import { SEO } from './constants/seo';
import Chat from './features/chat/pages/Chat';
import CompletedLessons from './features/completedLessons/CompletedLessons';
import Dashboard from './features/dashboard/Dashboard';
import Earnings from './features/earnings/Earnings';
import ForgotPassword from './features/forgot-password/ForgotPassword';
import ResetPassword from './features/forgot-password/ResetPassword';
import Login from './features/login/Login';
import MyBookings from './features/my-bookings/MyBookings';
import AdditionalInformation
  from './features/my-profile/pages/AdditionalInformation';
import ChildInformations from './features/my-profile/pages/ChildInformations';
import GeneralAvailability
  from './features/my-profile/pages/GeneralAvailability';
import MyTeachings from './features/my-profile/pages/MyTeachings';
import PersonalInformation
  from './features/my-profile/pages/PersonalInformation';
import ProfileAccount from './features/my-profile/pages/ProfileAccount';
import MyReviews from './features/myReviews/MyReviews';
import Notifications from './features/notifications/Notifications';
import Onboarding from './features/onboarding/Onboarding';
import Register from './features/register/Register';
import RoleSelection from './features/roleSelection/RoleSelection';
import SearchTutors from './features/searchTutors/SearchTutors';
import TutorProfile from './features/searchTutors/TutorProfile';
import TutorBookings from './features/tutor-bookings/TutorBookings';
import TutorManagment from './features/tutor-managment/TutorManagment';
import TutorManagmentProfile from './features/tutor-managment/TutorProfile';
import { useAppDispatch, useAppSelector } from './hooks';
import { Role } from './lookups/role';
import EmailConfirmed from './pages/EmailConfirmed';
import ResetToken from './pages/ResetToken';
import StripeConnected from './pages/StripeConnected';
import StripeFail from './pages/StripeFail';
import PermissionsGate from './PermissionGate';
import { getUserRoleAbrv } from './utils/getUserRoleAbrv';
import { setLang } from '../slices/langSlice';
import { Badge } from '@mui/material';

import { Signup } from './features/register/sign_up_rework/tutor/Signup';
import {
  SignupRoleSelect
} from './features/register/sign_up_rework/SignupRoleSelect';
import {
  TutorItemMobile
} from './features/searchTutors/components/TutorItemMobile';

export const PATHS = {
  ROLE_SELECTION: t('PATHS.ROLE_SELECTION'),
  REGISTER: t('PATHS.REGISTER'),
  FORGOT_PASSWORD: t('PATHS.FORGOT_PASSWORD'),
  RESET_PASSWORD: t('PATHS.RESET_PASSWORD'),
  LOGIN: t('PATHS.LOGIN'),
  MY_BOOKINGS: t('PATHS.MY_BOOKINGS'),
  SEARCH_TUTORS: t('PATHS.SEARCH_TUTORS'),
  SEARCH_TUTORS_TUTOR_PROFILE: t('PATHS.SEARCH_TUTORS_TUTOR_PROFILE'),
  SEARCH_TUTORS_TUTOR_BOOKINGS: t('PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS'),
  ONBOARDING: t('PATHS.ONBOARDING'),
  MY_REVIEWS: t('PATHS.MY_REVIEWS'),
  COMPLETED_LESSONS: t('PATHS.COMPLETED_LESSONS'),
  CHAT: t('PATHS.CHAT'),
  DASHBOARD: t('PATHS.DASHBOARD'),
  NOTIFICATIONS: t('PATHS.NOTIFICATIONS'),
  EARNINGS: t('PATHS.EARNINGS'),
  TERMS: t('PATHS.TERMS'),
  PRIVACY: t('PATHS.PRIVACY'),
  TUTOR_MANAGMENT: t('PATHS.TUTOR_MANAGMENT'),
  TUTOR_MANAGMENT_TUTOR_PROFILE: t('PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE'),
  EMAIL_CONFIRMED: t('PATHS.EMAIL_CONFIRMED'),
  RESEND_ACTIVATION_TOKEN: t('PATHS.RESEND_ACTIVATION_TOKEN'),
  STRIPE_CONNECTED: t('PATHS.STRIPE_CONNECTED'),
  STRIPE_FAIL: t('PATHS.STRIPE_FAIL'),
};

export const LANDING_PATHS = {
  HOW_IT_WORKS: t('PATHS.LANDING_PATHS.HOW_IT_WORKS'),
  BECOME_TUTOR: t('PATHS.LANDING_PATHS.BECOME_TUTOR'),
  PRICING: t('PATHS.LANDING_PATHS.PRICING'),
};

export const PROFILE_PATHS = {
  MY_PROFILE: t('PATHS.PROFILE_PATHS.MY_PROFILE'),
  MY_PROFILE_INFO: t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO'),
  MY_PROFILE_INFO_PERSONAL: t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL'),
  MY_PROFILE_INFO_AVAILABILITY: t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY'),
  MY_PROFILE_INFO_TEACHINGS: t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS'),
  MY_PROFILE_INFO_ADDITIONAL: t('PATHS.PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL'),
  MY_PROFILE_ACCOUNT: t('PATHS.PROFILE_PATHS.MY_PROFILE_ACCOUNT'),
  MY_PROFILE_CHILD_INFO: t('PATHS.PROFILE_PATHS.MY_PROFILE_CHILD_INFO'),
};

const tutor1 = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  profileImage: "https://avatars.sched.co/8/90/1938608/avatar.jpg?3fd",
  slug: "john-doe",
  currentOccupation: "Math Tutor",
  aboutTutor: "Passionate about teaching and helping students achieve their potential.",
  minPrice: 25,
  maxPrice: 50,
  averageGrade: 4.5,
  aboutLessons: "Interactive lessons tailored to each student's needs.",
  completedLessons: 1,
  currencyCode: "USD",
  yearsOfExperience: 5,
  subjects: ["maths", "physics", "statistics", "economics"],
  numberOfReviews: 2
};

const tutor2 = {
  id: "2",
  firstName: "Jane",
  lastName: "Smith",
  profileImage: "https://avatars.sched.co/8/90/1938608/avatar.jpg?3fd",
  slug: "jane-smith",
  currentOccupation: "English Tutor",
  aboutTutor: "Dedicated to building a learning environment that fosters curiosity and confidence.",
  minPrice: 45,
  maxPrice: 45,
  averageGrade: 4.8,
  aboutLessons: "Engaging lessons focused on improving comprehension and communication skills.",
  completedLessons: 200,
  currencyCode: "USD",
  yearsOfExperience: 6,
  subjects: ["english", "croatian", "german"],
  numberOfReviews: 31
};


interface IMenuItem {
  name: string;
  icon: string;
  key: string;
  path: string;
  rootPath?: string;
  disabled?: boolean;
}

interface IMenuPerRole {
  [key: string]: IMenuItem[];
}

export const ROUTES: any = [
  {
    path: '/en/mobile-tutor',
    key: 'mobitiu',
    exact: true,
    // component: () => <RoleSelection />,
    component: () =><div>


      <TutorItemMobile tutor={tutor1}/>
      <TutorItemMobile tutor={tutor2}/>
      <TutorItemMobile tutor={tutor1}/>

    </div>,
  },
  {
    path: PATHS.ROLE_SELECTION,
    key: 'ROLE_SELECTION',
    exact: true,
    // component: () => <RoleSelection />,
    component: () => <SignupRoleSelect />,
  },
  {
    path: PATHS.REGISTER,
    key: 'REGISTER',
    exact: true,
    // component: () => <Register />,
    component: () => <Signup />,
  },
  {
    path: PATHS.ONBOARDING,
    key: 'ONBOARDING',
    exact: true,
    roles: [Role.Tutor],
    isMenu: false,
    isPublic: true,
    component: () => <Onboarding />,
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    key: 'FORGOT_PASSWORD',
    exact: true,
    component: () => <ForgotPassword />,
  },
  {
    path: PATHS.RESET_PASSWORD,
    key: 'RESET_PASSWORD',
    exact: true,
    component: () => <ResetPassword />,
  },
  {
    path: PATHS.LOGIN,
    key: 'LOGIN',
    exact: true,
    component: () => <Login />,
  },
  {
    path: PATHS.MY_BOOKINGS,
    key: 'MY_BOOKINGS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
        <MyBookings />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.CHAT,
    key: 'CHAT',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
        <Chat />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.MY_REVIEWS,
    key: 'MY_REVIEWS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin]}>
        <MyReviews />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.DASHBOARD,
    key: 'DASHBOARD',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin, Role.Parent, Role.Student, Role.Child]}>
        <Dashboard />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.NOTIFICATIONS,
    key: 'NOTIFICATIONS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin, Role.Parent, Role.Student, Role.Child]}>
        <Notifications />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.EARNINGS,
    key: 'EARNINGS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Tutor, Role.SuperAdmin]} checkStripeConnection>
        <Earnings />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.SEARCH_TUTORS,
    key: 'SEARCH_TUTORS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin]}>
        <SearchTutors />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.SEARCH_TUTORS_TUTOR_PROFILE,
    key: 'SEARCH_TUTORS_TUTOR_PROFILE',
    exact: true,
    component: () => (
        <TutorProfile />
    ),
  },
  {
    path: PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS,
    key: 'SEARCH_TUTORS_TUTOR_BOOKINGS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin]}>
        <TutorBookings />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.COMPLETED_LESSONS,
    key: 'COMPLETED_LESSONS',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.Parent, Role.Student, Role.SuperAdmin, Role.Child]}>
        <CompletedLessons />
      </PermissionsGate>
    ),
  },
  {
    path: PROFILE_PATHS.MY_PROFILE,
    key: 'MY_PROFILE',
    component: (props: any) => {
      return (
        <PermissionsGate roles={[Role.Tutor, Role.Parent, Role.Student, Role.SuperAdmin]}>
          <RenderRoutes {...props} />
        </PermissionsGate>
      );
    },
    routes: [
      {
        path: PROFILE_PATHS.MY_PROFILE_INFO,
        key: 'MY_PROFILE_INFO',
        component: (props: any) => <RenderRoutes {...props} />,
        routes: [
          {
            path: PROFILE_PATHS.MY_PROFILE_INFO_PERSONAL,
            key: 'MY_PROFILE_INFO_PERSONAL',
            exact: true,
            component: () => <PersonalInformation />,
          },
          {
            path: PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY,
            key: 'MY_PROFILE_INFO_AVAILABILITY',
            exact: true,
            component: () => <GeneralAvailability />,
          },
          {
            path: PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS,
            key: 'MY_PROFILE_INFO_TEACHINGS',
            exact: true,
            component: () => <MyTeachings />,
          },
          {
            path: PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL,
            key: 'MY_PROFILE_INFO_ADDITIONAL',
            exact: true,
            component: () => <AdditionalInformation />,
          },
        ],
      },
      {
        path: PROFILE_PATHS.MY_PROFILE_ACCOUNT,
        key: 'MY_PROFILE_ACCOUNT',
        exact: true,
        component: () => <ProfileAccount />,
      },
      {
        path: PROFILE_PATHS.MY_PROFILE_CHILD_INFO,
        key: 'MY_PROFILE_CHILD_INFO',
        exact: true,
        component: () => <ChildInformations />,
      },
    ],
  },
  {
    path: PATHS.TUTOR_MANAGMENT,
    key: 'TUTOR_MANAGMENT',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.SuperAdmin]}>
        <TutorManagment />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.TUTOR_MANAGMENT_TUTOR_PROFILE,
    key: 'TUTOR_MANAGMENT_TUTOR_PROFILE',
    exact: true,
    component: () => (
      <PermissionsGate roles={[Role.SuperAdmin]}>
        <TutorManagmentProfile />
      </PermissionsGate>
    ),
  },
  {
    path: PATHS.EMAIL_CONFIRMED,
    key: 'EMAIL_CONFIRMED',
    exact: true,
    component: () => <EmailConfirmed />,
  },
  {
    path: PATHS.RESEND_ACTIVATION_TOKEN,
    key: 'RESEND_ACTIVATION_TOKEN',
    exact: true,
    component: () => <ResetToken />,
  },
  {
    path: PATHS.STRIPE_CONNECTED,
    key: 'STRIPE_CONNECTED',
    exact: true,
    component: () => <StripeConnected />,
  },
  {
    path: PATHS.STRIPE_FAIL,
    key: 'STRIPE_FAIL',
    exact: true,
    component: () => <StripeFail />,
  },
];
//handle subroutes by <RenderRoutes {...props} /> inside PermissionGate if needed

export default ROUTES;

function RouteWithSubRoutes(route: any) {
  return (
    <Route key={route.key} path={route.path} exact={route.exact} render={(props: any) => <route.component {...props} routes={route.routes} />} />
  );
}

export function RenderRoutes(routesObj: any) {
  const { routes } = routesObj;
  const { i18n } = useTranslation();
  const history = useHistory();
  const [locationKeys, setLocationKeys] = useState<(string | undefined)[]>([]);
  const dispatch = useAppDispatch();

  const syncLanguage = () => {
    const match = '/:lang(' + Array.from(languageOptions.map((l) => l.path)).join('|') + ')';

    if (
      matchPath(location.pathname, {
        path: match,
      })
    ) {
      const lang = matchPath(location.pathname, {
        path: match,
      })?.params.lang;

      document.documentElement.lang = lang;
      dispatch(setLang(lang));

      if (lang !== i18n.language) {
        i18n.changeLanguage(lang);
        window.location.reload();
      }

      if (location.pathname.replaceAll('/', '') === lang) {
        history.push(t('PATHS.LOGIN'));
      }
    } else {
      const lang = i18n.languages[i18n.languages.length - 1];
      i18n.changeLanguage(lang);
      dispatch(setLang(lang));

      location.pathname.length > 1
        ? history.push(`/${i18n.languages[i18n.languages.length - 1]}${location.pathname}${location.search ? location.search : ''}`)
        : history.push(t('PATHS.LOGIN'));
    }
  };

  useEffect(() => {
    return history.listen((location: any) => {
      if (history.action === 'PUSH') {
        if (location.key) setLocationKeys([location.key]);
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          syncLanguage();
        }
      }
    });
  }, [locationKeys]);

  useEffect(() => {
    syncLanguage();
  }, []);

  return (
    <>
      <Switch>
        {routes.map((route: any) => {
          return <RouteWithSubRoutes key={route.key} {...route} />;
        })}
        {/*<Route component={() => <NotFound />} />*/}
        {/*<Redirect to='/' />*/}
      </Switch>
      <SEO />
    </>
  );
}

//has to be in this file to prevent app crash when importing
export function menuPerRole(stripeConnected: boolean): IMenuPerRole {
  return {
    [Role.Tutor]: [
      {
        name: 'DASHBOARD',
        icon: 'dashboard',
        key: 'DASHBOARD',
        path: PATHS.DASHBOARD,
      },
      {
        name: 'MY_BOOKINGS',
        icon: 'calendar',
        key: 'MY_BOOKINGS',
        path: PATHS.MY_BOOKINGS,
      },
      {
        name: 'CHAT',
        icon: 'chat',
        key: 'CHAT',
        path: PATHS.CHAT,
      },
      {
        name: 'MY_REVIEWS',
        icon: 'reviews',
        key: 'MY_REVIEWS',
        path: PATHS.MY_REVIEWS,
      },
      {
        name: 'EARNINGS',
        icon: 'earnings',
        key: 'EARNINGS',
        path: PATHS.EARNINGS,
        disabled: !stripeConnected,
      },
    ],
    [Role.Student]: [
      {
        name: 'DASHBOARD',
        icon: 'dashboard',
        key: 'DASHBOARD',
        path: PATHS.DASHBOARD,
      },
      {
        name: 'MY_BOOKINGS',
        icon: 'calendar',
        key: 'MY_BOOKINGS',
        path: PATHS.MY_BOOKINGS,
      },
      {
        name: 'CHAT',
        icon: 'chat',
        key: 'CHAT',
        path: PATHS.CHAT,
      },
      {
        name: 'SEARCH_TUTORS',
        icon: 'search-tutors',
        key: 'SEARCH_TUTORS',
        path: PATHS.SEARCH_TUTORS,
      },
      {
        name: 'COMPLETED_LESSONS',
        icon: 'completed-lessons',
        key: 'COMPLETED_LESSONS',
        path: PATHS.COMPLETED_LESSONS,
      },
    ],
    [Role.Parent]: [
      {
        name: 'DASHBOARD',
        icon: 'dashboard',
        key: 'DASHBOARD',
        path: PATHS.DASHBOARD,
      },
      {
        name: 'MY_BOOKINGS',
        icon: 'calendar',
        key: 'MY_BOOKINGS',
        path: PATHS.MY_BOOKINGS,
      },
      {
        name: 'CHAT',
        icon: 'chat',
        key: 'CHAT',
        path: PATHS.CHAT,
      },
      {
        name: 'SEARCH_TUTORS',
        icon: 'search-tutors',
        key: 'SEARCH_TUTORS',
        path: PATHS.SEARCH_TUTORS,
      },
      {
        name: 'COMPLETED_LESSONS',
        icon: 'completed-lessons',
        key: 'COMPLETED_LESSONS',
        path: PATHS.COMPLETED_LESSONS,
      },
    ],
    [Role.SuperAdmin]: [
      {
        name: 'TUTOR_MANAGMENT',
        icon: 'tutor-managment',
        key: 'TUTOR_MANAGMENT',
        path: PATHS.TUTOR_MANAGMENT,
      },
      {
        name: 'CHAT',
        icon: 'chat',
        key: 'CHAT',
        path: PATHS.CHAT,
      },
    ],
    [Role.Child]: [
      {
        name: 'MY_BOOKINGS',
        icon: 'calendar',
        key: 'MY_BOOKINGS',
        path: PATHS.MY_BOOKINGS,
      },
      {
        name: 'CHAT',
        icon: 'chat',
        key: 'CHAT',
        path: PATHS.CHAT,
      },
      {
        name: 'COMPLETED_LESSONS',
        icon: 'completed-lessons',
        key: 'COMPLETED_LESSONS',
        path: PATHS.COMPLETED_LESSONS,
      },
    ],
  };
}

export function RenderMenuLinks() {
  const userRole = getUserRoleAbrv();
  const user = useAppSelector((state) => state.user);

  const chat = useAppSelector((state) => state.chat);

  const { t } = useTranslation();

  const badgeStyle = {
    "& .MuiBadge-badge": {
      color: 'white',
      backgroundColor: '#7E6CF2',
    }
  };

  const [showBadge, setShowBadge] = useState(false);
  const [doAnimation, setDoAnimation] = useState(true);
  const [oldNumOfNewMessages, setoldNumOfNewMessages] = useState(chat.newMessages);
  // Function to trigger the badge pop-up animation

  const  isMobile = window.innerWidth <1200;

  useEffect(() => {
    if(chat.newMessages){

      if(chat.newMessages == 0){
        setDoAnimation(true);
      }

      if(chat.newMessages > 0 && doAnimation && oldNumOfNewMessages != chat.newMessages){
        setShowBadge(true);

        setTimeout(() => {
          setShowBadge(false);
        }, 1800);

        setDoAnimation(false);
        setoldNumOfNewMessages(chat.newMessages);
      }
    }
  }, [chat.newMessages]);

  if (userRole) {
    return (
      <>
        {menuPerRole(user?.user?.stripeConnected || false)[userRole].map((route: any) =>
          route.disabled ? (
            <div className={`navbar__item`} style={{ cursor: route.disabled ? 'not-allowed' : 'pointer' }}>
              <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
              <span className={`navbar__item__label`}>{t(`NAVIGATION.${route.name}`)}</span>
              {route.key == 'CHAT' && chat.newMessages != null && chat.newMessages > 0 && <i className={`navbar__item__unread`}></i>}
            </div>
          ) : (
            <NavLink
              key={route.key}
              to={route.path}
              className={`navbar__item`}
              activeClassName="active"
              isActive={(match: any, location: Location) => {
                //format nicer later
                if (route.rootPath) {
                  if (location.pathname.startsWith(route.rootPath)) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  if (!match) {
                    return false;
                  }
                }

                return true;
              }}
            >

              {(route.key == 'CHAT' && chat.newMessages != null && chat.newMessages > 0) ?
                  <Badge badgeContent={chat.newMessages}
                         className={showBadge ? 'badge-pulse' : ''}
                         sx={badgeStyle}
                         max={10}>
                    <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
                  </Badge>
                  :
                  <i className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}></i>
              }
              <span className={`navbar__item__label ${isMobile ? 'font__lg' : ''}`}>{t(`NAVIGATION.${route.name}`)}</span>
            </NavLink>
          )
        )}
      </>
    );
  }

  return <></>;
}
