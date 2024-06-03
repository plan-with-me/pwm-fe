export default function getDateFormat(
  year: number,
  month: number,
  date: number
) {
  return `${year}-${month.toString().padStart(2, "0")}-${date
    .toString()
    .padStart(2, "0")}`;
}
