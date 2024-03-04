import { IVideoLesson } from '../../../constants/completedLessonsList';

interface Props {
    videoLesson: IVideoLesson;
}

const VideoLessonItem = (props: Props) => {
    const { videoLesson } = props;

    return (
        <div key={videoLesson.id} className="dash-wrapper__item">
            <div className="dash-wrapper__item__element flex--primary">
                <div className="flex flex--center">
                    <i className="icon icon--lg icon--play icon--primary"></i>
                    <div className="ml-4">
                        <div className="type--wgt--bold">{videoLesson.name}</div>
                        <div className="type--color--secondary">{videoLesson.date}</div>
                    </div>
                </div>
                <div>
                    <i className="icon icon--base icon--download icon--primary"></i>
                </div>
            </div>
        </div>
    );
};

export default VideoLessonItem;
