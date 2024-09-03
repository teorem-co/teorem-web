import IOnboardingAvailability from './IOnboardingAvailability';
import IOnboardingDegree from './IOnboardingDegree';
import IOnboardingSubject from './IOnboardingSubject';

export default interface ITutorOnboardingFormValues {
    subjects?: IOnboardingSubject[]; //done
    timeZone?: string;
    availability?: IOnboardingAvailability[];
    imageLink?: string; // done
    hasNoDegree?: boolean; // done
    degrees?: IOnboardingDegree[]; //done
    profileTitle?: string; // done
    profileDescription?: string; // done
    videoId?: string; // done
    autoAcceptBooking: boolean | null;
    price?: number; // done
    isCompany: boolean | null; // done
    ssn4Digits?: string; // for US, done
    oib?: string; // for HR, done
    companyName?: string; // done
    routingNumber?: string; // for US, done
    accountNumber?: string; // for US, done
    iban?: string; //for HR, done
    addressCountryId?: string; // done
    addressState?: string; // for US, done
    addressStreet?: string; // done
    addressApartment?: string;
    postalCode?: string; // done
    city?: string; // done
}
