
interface Props{
  title:string,
  desc: string
}

export const InformationCard = (props: Props) => {
  const {title, desc} = props;
  return (
    <div className="card card--primary mb-2">
      <div className="flex--primary mb-2">
        <div className="flex--center">
          <span>{title}</span>
          <div className="type--color--secondary mt-2" dangerouslySetInnerHTML={{__html: desc}}></div>
        </div>
        <div className="type--color--tertiary"></div>
      </div>
    </div>
  );
};
