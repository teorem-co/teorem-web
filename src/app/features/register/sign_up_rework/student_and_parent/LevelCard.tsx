import ILevel from '../../../../../interfaces/ILevel';
import { t } from 'i18next';

interface Props{
  level:ILevel,
  onClick?: () => void
  isSelected:boolean
}

export const LevelCard = (props: Props) => {
  const {level, onClick, isSelected}= props;

  return (
    <>
      <div
        onClick={onClick}
        className="level-card flex card--primary cur--pointer scale-hover--scale-110 "
        style={{
          borderRadius: '10px',
          height:'60px',
          width:'100px',
          alignContent:'center',
          justifyContent:'center',
          alignItems:'center',
          backgroundColor: isSelected ? '#7e6cf2' : 'white',
          color: isSelected? 'white' : 'black'}}
      >
        <span className="font__lgr"> {t(`LEVELS.${level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</span>
      </div>
    </>
  );
};
