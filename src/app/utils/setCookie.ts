export default function setCookie(
    name: string,
    value: any,
    expireMillis = 1 * 1 * 60 * 60 * 1000 // 1 hour
) {
    const date = new Date();

    date.setTime(date.getTime() + expireMillis);

    // Set it
    document.cookie =
        name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
}
