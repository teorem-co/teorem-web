import IFAQItem from '../interfaces/IFAQItem';
import FAQItem from './FAQItem';

interface Props {
    data: IFAQItem[];
}

const FAQGroup = (props: Props) => {
    const { data } = props;
    return (
        <div className="landing__faq mt-10">
            {data.map((currentFAQItem: IFAQItem) => {
                return <FAQItem key={currentFAQItem.id} data={currentFAQItem} />;
            })}
        </div>
    );
};

export default FAQGroup;
