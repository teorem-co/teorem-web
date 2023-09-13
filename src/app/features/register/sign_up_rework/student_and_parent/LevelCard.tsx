
interface Props{
  id: string,
  name: string,
  onClick?: () => void
  isSelected:boolean
}

export const LevelCard = (props: Props) => {
  const {id,name, onClick, isSelected}= props;

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
        <span className="font__lgr">{name}</span>
      </div>
    </>
  );
};
