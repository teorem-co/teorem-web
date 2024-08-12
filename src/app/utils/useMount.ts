import { EffectCallback, useEffect, useRef } from 'react';

export default function useMount(fn: EffectCallback) {
    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        return fn();
    }, []);
}
