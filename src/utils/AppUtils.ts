import dayjs from "dayjs";

export function makeCalendarArray(year: number, month: number): string[] {
  //1월: 0 ~ 12월: 11
  //일: 0 ~ 토: 6
  const firstDate = dayjs(new Date(year, month - 1, 1));
  const lastDate = dayjs(new Date(year, month, 0));
  const totalDays = lastDate.get("date");
  const dayOfFirstDate = firstDate.day();

  const totalWeeks = Math.ceil((dayOfFirstDate + totalDays) / 7);
  const result = Array(7 * totalWeeks).fill(null);

  for (let i = 0; i < totalDays; i++) {
    result[dayOfFirstDate + i] = firstDate.add(i, "day").format("YYYY-MM-DD");
  }

  return result;
}
