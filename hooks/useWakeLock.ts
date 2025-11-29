import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

    const requestWakeLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                console.log('Wake Lock active');

                lock.addEventListener('release', () => {
                    console.log('Wake Lock released');
                    setWakeLock(null);
                });
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    }, []);

    useEffect(() => {
        // Request lock on mount
        requestWakeLock();

        // Re-request if visibility changes (e.g. user switches tabs and comes back)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !wakeLock) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (wakeLock) {
                wakeLock.release();
            }
        };
    }, [requestWakeLock, wakeLock]);

    return { isLocked: !!wakeLock };
};
