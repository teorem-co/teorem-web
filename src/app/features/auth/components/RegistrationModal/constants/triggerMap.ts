import ANALYTICS_TRIGGER_IDS from '../../../../../constants/analyticsTriggerIds';
import { Role } from '../../../../../types/role';

const TRIGGER_MAP: Record<Role, string> = {
    [Role.Student]: ANALYTICS_TRIGGER_IDS.STUDENT_FINISH_REGISTRATION,
    [Role.Tutor]: ANALYTICS_TRIGGER_IDS.TUTOR_FINISH_REGISTRATION,
    [Role.Parent]: ANALYTICS_TRIGGER_IDS.PARENT_FINISH_REGISTRATION,
    [Role.Child]: '',
    [Role.SuperAdmin]: '',
};

export default TRIGGER_MAP;
