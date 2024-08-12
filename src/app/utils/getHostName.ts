export default function getHostName() {
    const hostname = window.location.hostname;
    const lastIndex = hostname.lastIndexOf('.');
    if (lastIndex !== -1) {
        const domain = hostname.substring(lastIndex); //.co, .hr etc
        return 'https://app.teorem' + domain;
    } else {
        // If dot is not found, return localhost, because it is probably localhost??
        return 'http://localhost:3000';
    }
}
