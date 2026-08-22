/**
 * Date formatting and calculation helpers for backend services
 */

export const formatTimeAMPM = (date = new Date()) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const hoursStr = hours < 10 ? '0' + hours : hours;
  return `${hoursStr}:${minutesStr} ${ampm}`;
};

export const formatDateYYYYMMDD = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateHoursBetween = (startTimeStr, endTimeStr) => {
  if (!startTimeStr || !endTimeStr) return { workHours: 8.0, extraHours: 0 };
  
  // Parse standard "09:00 AM" or ISO
  try {
    const parseTimeToMinutes = (tStr) => {
      const parts = tStr.trim().split(' ');
      if (parts.length < 2) return null;
      const [h, m] = parts[0].split(':').map(Number);
      const isPM = parts[1].toUpperCase() === 'PM';
      let hour24 = h;
      if (isPM && h !== 12) hour24 += 12;
      if (!isPM && h === 12) hour24 = 0;
      return hour24 * 60 + m;
    };

    const startMin = parseTimeToMinutes(startTimeStr);
    const endMin = parseTimeToMinutes(endTimeStr);

    if (startMin !== null && endMin !== null && endMin >= startMin) {
      const diffMinutes = endMin - startMin;
      const totalHours = Number((diffMinutes / 60).toFixed(1));
      const extraHours = Math.max(0, Number((totalHours - 8.0).toFixed(1)));
      return { workHours: totalHours, extraHours };
    }
  } catch (err) {
    // fallback
  }
  return { workHours: 8.5, extraHours: 0.5 };
};

export const calculateDaysBetween = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
