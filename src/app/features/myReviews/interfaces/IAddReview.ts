interface IAddReview {
    subjectId: string;
    tutorId: string;
    studentId: string;
    comment: string;
    mark: number;
    punctualityMark: number;
    knowledgeMark: number;
    communicationMark: number;
}

export default IAddReview;
