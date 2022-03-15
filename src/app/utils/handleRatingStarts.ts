const handleRatingStars = (mark: number) => {
    const splitedMark = mark.toString().split('.');
    const firstOffset = Number(splitedMark[0]) * 32;
    let secondOffset = 0;
    if (splitedMark.length > 1) {
        secondOffset = Number(splitedMark[1]) * 2;
    }
    const finalOffset = 2 + firstOffset + secondOffset;

    return finalOffset;
};

export default handleRatingStars;
