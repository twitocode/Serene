/** Calendar date in the user's local timezone as YYYY-MM-DD (not UTC). */
export function formatLocalDateKey(d: Date): string {
	const y = d.getFullYear();
	const m = d.getMonth() + 1;
	const day = d.getDate();
	return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const getCurrentDate = () => formatLocalDateKey(new Date());
