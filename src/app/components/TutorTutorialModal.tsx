interface Props{
  skip: () => void,
  start: () => void,
}


export const TutorTutorialModal = (props: Props) => {
  const {skip, start} = props;

  return (
    <>
    <div className='modal__overlay'>
      <div className='modal flex flex--col flex--ai--center flex--jc--space-between w--550 h--200 dash-border '>
      <h2 className='pt-1'>Zelite li proci tutorial</h2>
      <span>Tutorial ce vas ukratko upoznati s osnovnim funkcionalnostima Teorema</span>
      <div className='flex flex--row flex--jc--space-between pb-1 w--100 pl-10 pr-10'>
        <button className='btn btn--lg btn--primary' onClick={skip}>Preskoci</button>
        <button className='btn btn--lg btn--primary' onClick={start}>Zelim</button>
      </div>
      </div>
    </div>
    </>
  );
};
