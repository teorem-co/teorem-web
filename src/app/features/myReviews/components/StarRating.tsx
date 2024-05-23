import { Star } from '@mui/icons-material';
import { Rating, styled } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { RatingPropsSizeOverrides } from '@mui/material/Rating/Rating';

interface Props {
    mark: number;
    size?: OverridableStringUnion<'small' | 'medium' | 'large', RatingPropsSizeOverrides>;
}

export const StarRating = (props: Props) => {
    const { mark, size } = props;
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#7e6cf2',
        },
        '& .MuiRating-iconEmpty': {
            color: 'lightgrey',
        },
    });

    return (
        <>
            <StyledRating
                size={size}
                name="simple-controlled"
                value={mark}
                color={'blue'}
                precision={0.1}
                readOnly
                emptyIcon={<Star fontSize={'inherit'} />}
            />
        </>
    );
};
