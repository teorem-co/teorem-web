import { ReactNode, cloneElement, FC, Children } from 'react';
import {
  Calendar,
  momentLocalizer,
  DateCellWrapperProps, Views, SlotInfo,
} from 'react-big-calendar';
import moment from "moment";
const localizer = momentLocalizer(moment);


interface TouchCellWrapperProps {
  children: any;
  value: Date;
  onSelectSlot: (info: { action: string, slots: Date[] }) => void;
}

const TouchCellWrapper: FC<TouchCellWrapperProps> = ({ children, value, onSelectSlot }) =>
  cloneElement(Children.only(children), {
    onTouchEnd: () => onSelectSlot({ action: "click", slots: [value] }),
  });

export const CalendarTest: FC = () => {


  const onSelectSlot = ({ action, slots /*, ...props */ }: { action: string, slots: Date[] }) => {
    console.log("onSelectSlot", slots);
    if (action === "click") {
      console.log("click");
    }
    return false;
  };


  return (
    <Calendar
      onSelecting={()=> false}
      view={Views.WEEK}
      components={{
         dateCellWrapper: (props: DateCellWrapperProps) =>
          (<TouchCellWrapper onSelectSlot={onSelectSlot} children={props.children} value={props.value}></TouchCellWrapper> )

    }}
      events={[]}
      localizer={localizer}
      onSelectSlot={onSelectSlot}
      step={15}
      longPressThreshold={150}
      selectable={true}
      timeslots={4}
      style={{ minHeight: 800 }}
    />
  );
};
