import { Settings } from '@/types';

export const getLocalTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatTime = (date: Date, timeZone: string, use24Hour: boolean) =>
  new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
  }).format(date);

export const getTimeZoneOffsetLabel = (timeZone: string, date: Date = new Date()) => {
  const text = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const part = text.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  return part.replace('UTC', 'GMT');
};

export const getOffsetDifference = (targetZone: string, localZone: string, date: Date = new Date()) => {
  const localOffset = getMinutesOffset(localZone, date);
  const targetOffset = getMinutesOffset(targetZone, date);
  const diff = targetOffset - localOffset;
  if (diff === 0) return 'Same time';
  const sign = diff > 0 ? '+' : '-';
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return minutes === 0 ? `${sign}${hours}h` : `${sign}${hours}h ${minutes}m`;
};

const getMinutesOffset = (timeZone: string, date: Date) => {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const lookup = (type: string) => Number(formatted.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(
    lookup('year'),
    lookup('month') - 1,
    lookup('day'),
    lookup('hour'),
    lookup('minute'),
    lookup('second'),
  );
  return (asUtc - date.getTime()) / 60000;
};

export const isDayTime = (date: Date, timeZone: string) => {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      hour12: false,
    })
      .formatToParts(date)
      .find((p) => p.type === 'hour')?.value ?? 0,
  );
  return hour >= 6 && hour < 18;
};

export const defaultSettings: Settings = {
  use24Hour: false,
  theme: 'dark',
  defaultSnooze: 10,
  autoDetectTimezone: true,
};
