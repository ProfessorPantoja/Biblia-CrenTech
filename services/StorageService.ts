export const StorageService = {
    save: <T>(key: string, data: T): void => {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error(`StorageService: Failed to save key "${key}"`, error);
        }
    },

    load: <T>(key: string, defaultValue: T): T => {
        try {
            const serialized = localStorage.getItem(key);
            if (!serialized) return defaultValue;
            return JSON.parse(serialized) as T;
        } catch (error) {
            console.error(`StorageService: Failed to load key "${key}"`, error);
            return defaultValue;
        }
    },

    clear: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`StorageService: Failed to clear key "${key}"`, error);
        }
    }
};
