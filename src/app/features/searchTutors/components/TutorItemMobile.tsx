import ImageCircle from '../../../components/ImageCircle';
import CustomSubjectList from './CustomSubjectList';
import ITutorItem from '../../../../interfaces/ITutorItem';
import { AiFillStar } from 'react-icons/ai';


interface Props {
  tutor?: ITutorItem;
}


export const TutorItemMobile = (props: Props) => {
  return (
    <>
    <div className="card--primary flex flex--row m-2 font__sm flex--ai--center font-family__montserrat">

      <img
        className="mr-3"
        src='/logo512.png' alt='slika' width={80} height={80}/>

      <div className='basic-info flex flex--col flex--jc--space-between w--100'>
          <div className='flex flex--row flex--jc--space-between mb-2 font__md'>
            <span className="d--b type--wgt--bold">Antonio B.</span>
            <span><span className="type--wgt--bold font__sm">EUR 39 - EUR 40</span><span>/h</span></span>
          </div>
          <span className="d--b font__11">Student istraživačke fizike na PMF-u</span>

          <div className='subject-containers flex flex--col flex--wrap mt-2 font__11 mb-1' style={{fontSize:'9px'}}>
           <CustomSubjectList subjects={["maths", "croatian", "german", "biology"]}/>
          </div>

        <div className="flex flex--row flex--ai--center flex--jc--space-between font__11">
          <span className="d--b">351 lessons</span>
         <div className="flex flex--row">
           <div className="rating flex flex--row flex--ai--center">
             {/*<i className="icon icon--star icon--sm icon--grey"></i>*/}
             <AiFillStar color={"#7e6cf2"} size={15}/>
             <span>5</span>
           </div>
           <span className="pr-1 pl-1"> • </span>
           <span className="d--b">78 reviews</span>
         </div>
        </div>
      </div>

    </div>
    </>
  );
};
