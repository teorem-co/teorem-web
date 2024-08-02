import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import useMount from '../../../utils/useMount';
import { useConfirmLoginMutation } from '../../../store/services/authService';
import removeParamsFromURI from '../../../utils/removeParamsFromUri';
import { setToken } from '../../../store/slices/authSlice';

interface IAuthWrapperProps {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AuthWrapper({ children, fallback }: Readonly<IAuthWrapperProps>) {
    const { user, token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [confirmLogin, { isLoading, isError, isSuccess }] = useConfirmLoginMutation();

    useMount(() => {
        if (user && token) {
            return setIsLoaded(true);
        }
        const params = new URLSearchParams(window.location.search);

        const loginToken = params.get('login_token');

        if (!loginToken) {
            return setIsLoaded(true);
        }

        confirmLogin({
            loginToken,
        })
            .unwrap()
            .then((res) => {
                dispatch(setToken(res));
                setIsLoaded(true);

                window.history.replaceState(null, '', removeParamsFromURI({ params: ['login_token'], uri: window.location.href }));
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                setIsLoaded(true);
            });
    });

    if (!isLoaded) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
