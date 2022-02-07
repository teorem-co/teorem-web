//import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

//import { Carousel } from 'react-responsive-carousel';
import calendar from '../../../../assets/images/landing_calendar.jpg';
import tutorList from '../../../../assets/images/landing_tutor_list.jpg';

const ImageSlider = () => {
    return (
        // <Carousel
        //     autoPlay={true}
        //     infiniteLoop={true}
        //     showIndicators={false}
        //     showThumbs={false}
        //     showStatus={false}
        //     showArrows={false}
        //     centerMode={true}
        //     centerSlidePercentage={70}
        //     className="landing__slider"
        // >
        <>
            <div>
                <img src={calendar} className="landing__img" alt="calendar" />
            </div>
            <div>
                <img src={tutorList} className="landing__img" alt="tutorList" />
            </div>
            <div>
                <img src={calendar} className="landing__img" alt="calendar" />
            </div>
        </>
        // </Carousel>
    );
};

export default ImageSlider;
