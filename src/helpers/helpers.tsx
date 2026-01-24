export const getTimeElapsed = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const elapsed = now.getTime() - past.getTime();
    const seconds = Math.max(0, Math.floor(elapsed / 1000));
    const minutes = Math.max(0, Math.floor(seconds / 60));
    const hours = Math.max(0, Math.floor(minutes / 60));
    const days = Math.max(0, Math.floor(hours / 24));
    if (days > 0) {
        return `${days} day${days != 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours != 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes != 1 ? "s" : ""} ago`;
    } else {
        return `${seconds} second${seconds != 1 ? "s" : ""} ago`;
    }
}