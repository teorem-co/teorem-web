import { baseService } from '../baseService';
import { HttpMethods } from '../../types/httpMethods';

//bookings/week/:tutorSlug

const URL = '/api/v1/tutorials';

export interface ITutorialState {
    isFinished: boolean;
}

export const languageService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getTutorialState: builder.query<ITutorialState, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        finishTutorial: builder.mutation<ITutorialState, string>({
            query: (userId) => ({
                url: `${URL}/${userId}/finish`,
                method: HttpMethods.POST,
                body: {},
            }),
        }),
    }),
});

export const { useLazyGetTutorialStateQuery, useFinishTutorialMutation } = languageService;
