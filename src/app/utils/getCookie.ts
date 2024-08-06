export default function getCookie(name: string) {
    const cookieString = '; ' + document.cookie;
    const parts = cookieString.split('; ' + name + '=');
    if (!parts) {
        return null;
    }
    if (parts.length === 2) {
        const value = parts[1].split(';')[0];
        return value.toLowerCase() === 'null' ? null : value;
    }
    return null;
}
