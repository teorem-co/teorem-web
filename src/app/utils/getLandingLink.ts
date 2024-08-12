export default function getLandingLink() {
    if (process.env.REACT_APP_LANDING_HOSTNAME) {
        return process.env.REACT_APP_LANDING_HOSTNAME;
    }

    const hostname = window.location.hostname;
    const lastIndex = hostname.lastIndexOf('.');
    if (lastIndex !== -1) {
        const domain = hostname.substring(lastIndex); //.co, .hr etc
        return 'https://www.teorem' + domain;
    } else {
        // If dot is not found, return localhost, because it is probably localhost
        return 'http://localhost:3000';
    }
}
