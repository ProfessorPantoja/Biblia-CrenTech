import { useState, useEffect, useCallback, useRef } from 'react';

export const useWakeLock = () => {
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);
    const debugWakeLock = import.meta.env.VITE_WAKELOCK_DEBUG === '1';

    const requestWakeLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            if (wakeLockRef.current) return;
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                wakeLockRef.current = lock;
                if (debugWakeLock) console.log('Wake Lock active');

                lock.addEventListener('release', () => {
                    if (debugWakeLock) console.log('Wake Lock released');
                    setWakeLock(null);
                    wakeLockRef.current = null;
                });
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    }, [debugWakeLock]);

    useEffect(() => {
        // Request lock on mount
        requestWakeLock();

        // Re-request if visibility changes (e.g. user switches tabs and comes back)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !wakeLockRef.current) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (wakeLockRef.current) {
                wakeLockRef.current.release();
            }
        };
    }, [requestWakeLock]);

    return { isLocked: !!wakeLock };
};
