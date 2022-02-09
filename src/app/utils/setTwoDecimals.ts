const setTwoDecimals = (number: number | string) => {
    const myString = number.toString();
    const splittedArray = myString.split('.');
    const decimalPart = splittedArray[1].substring(0, 2);
    return splittedArray[0] + '.' + decimalPart;
};

export default setTwoDecimals;
