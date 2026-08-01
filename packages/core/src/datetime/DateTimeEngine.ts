/**
 * Advanced First-Principles Core Engine: Timezone & Business Calendar Engine.
 * Business day calculation, date range calculations, and relative time helpers.
 */
export class DateTimeEngine {
  public static addBusinessDays(startDate: Date, daysToAdd: number, holidays: Date[] = []): Date {
    const result = new Date(startDate.getTime());
    let added = 0;

    const holidayStrings = new Set(holidays.map(d => d.toISOString().split('T')[0]));

    while (added < daysToAdd) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      const dateString = result.toISOString().split('T')[0];

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
      const isHoliday = holidayStrings.has(dateString);

      if (!isWeekend && !isHoliday) {
        added++;
      }
    }

    return result;
  }

  public static formatRelativeTime(date: Date, now: Date = new Date()): string {
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const absSeconds = Math.abs(diffSeconds);

    if (absSeconds < 60) {
      return diffSeconds >= 0 ? 'just now' : `${absSeconds} seconds ago`;
    }

    const absMinutes = Math.round(absSeconds / 60);
    if (absMinutes < 60) {
      return diffSeconds >= 0 ? `in ${absMinutes} minutes` : `${absMinutes} minutes ago`;
    }

    const absHours = Math.round(absMinutes / 60);
    if (absHours < 24) {
      return diffSeconds >= 0 ? `in ${absHours} hours` : `${absHours} hours ago`;
    }

    const absDays = Math.round(absHours / 24);
    return diffSeconds >= 0 ? `in ${absDays} days` : `${absDays} days ago`;
  }
}
