import dayjs from "dayjs";

// Prevent webpack window problem
const isBrowser = () => typeof window !== "undefined";

const parseDate = (date?: string) => dayjs(date).format("YYYY/MM/DD");

export { isBrowser, parseDate };
