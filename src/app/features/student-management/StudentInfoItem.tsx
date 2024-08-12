import React from 'react';
import { useHistory } from 'react-router';
import { ITutorStudentSearch } from '../../store/services/userService';

export interface Props {
    studentInfo: ITutorStudentSearch;
}

export const StudentInfoItem = (props: Props) => {
    const { studentInfo } = props;
    const history = useHistory();

    return (
        <>
            <tr key={studentInfo.id}>
                <td>{studentInfo.firstName}</td>
                <td>{studentInfo.lastName}</td>
                <td>{studentInfo.email}</td>
                <td>{studentInfo.phone}</td>
            </tr>
        </>
    );
};
