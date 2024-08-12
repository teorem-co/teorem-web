export default function removeParamsFromURI({
    uri,
    params,
}: {
    uri?: string;
    params?: string[];
} = {}) {
    if (!params || !params.length) {
        return window.location.origin + window.location.pathname;
    }

    if (!uri) {
        uri = window.location.href;
    }

    const [url, search] = uri.split('?');

    const urlParams = new URLSearchParams(search);
    params.forEach((param) => {
        urlParams.delete(param);
    });

    return url + (urlParams.toString() ? `?${urlParams.toString()}` : '');
}
