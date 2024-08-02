import { HttpMethods } from '../../../lookups/httpMethods';
import { baseService } from '../../../store/baseService';

const URL = '/api/v1/vimeo';

export const vimeoService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getUploadVideoUrl: builder.query<string, number>({
            query: (size) => ({
                url: `${URL}/video/upload-link?size=${size}`,
                method: HttpMethods.GET,
            }),
        }),
        getVideoTranscodeStatus: builder.query<string, string>({
            query: (videoId) => ({
                url: `${URL}/video/${videoId}/transcode-status`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetUploadVideoUrlQuery } = vimeoService;
