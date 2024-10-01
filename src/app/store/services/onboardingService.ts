import { HttpMethods } from '../../types/httpMethods';
import { baseService } from '../baseService';
import IOnboardingState from '../../types/IOnboardingState';
import ITutorOnboardingFormValues from '../../features/onboarding/tutor/types/ITutorOnboardingFormValues';

const URL = '/api/v1/users';

interface IOnboardingStateRequest {
    step: number;
    substep: number;
    formData: string;
}

interface IAvailabilityRequestDTO {
    day: string;
    beforeNoon: boolean;
    noonToFive: boolean;
    afterFive: boolean;
}

export const onboardingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getOnboardingState: builder.query<IOnboardingState, { userId: string }>({
            query: ({ userId }) => ({
                url: `${URL}/${userId}/onboarding`,
                method: HttpMethods.GET,
            }),
        }),
        setOnboardingState: builder.mutation<
            IOnboardingState,
            { userId: string; onboardingState: IOnboardingStateRequest }
        >({
            query: ({ userId, onboardingState }) => ({
                url: `${URL}/${userId}/onboarding`,
                method: HttpMethods.PUT,
                body: onboardingState,
            }),
        }),
        finishOnboarding: builder.mutation<
            IOnboardingState,
            {
                userId: string;
                onboardingState: Omit<ITutorOnboardingFormValues, 'availability'> & {
                    availability: IAvailabilityRequestDTO[];
                };
                isPreview?: boolean;
            }
        >({
            query: ({ userId, onboardingState, isPreview }) => ({
                url: `${URL}/${userId}/onboarding-commit${isPreview ? '?preview=true' : ''}`,
                method: HttpMethods.POST,
                body: onboardingState,
            }),
        }),
    }),
});

export const {
    useLazyGetOnboardingStateQuery,
    useGetOnboardingStateQuery,
    useSetOnboardingStateMutation,
    useFinishOnboardingMutation,
} = onboardingService;
