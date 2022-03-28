import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

const URL = '/learn-cube';

export interface IGetRoomLink {
    userId: string;
    bookingId: string;
}

export const stripeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getRoomLink: builder.query<any, IGetRoomLink>({
            query: (params) => ({
                url: `${URL}/get-room-link/?userId=${params.userId}&bookingId=${params.bookingId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetRoomLinkQuery } = stripeService;
