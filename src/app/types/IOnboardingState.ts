export default interface IOnboardingState {
    userId: string;
    formData: string;
    step: number;
    substep: number;
    lastUpdated?: string;
}
