export function formatDate(value, showTime = false) {
  if (!value) return null;

  const d = new Date(value);

  if (isNaN(d)) return null;

  const date =
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0");

  if (!showTime) return date;

  const time =
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0");

  return `${date} ${time}`;
}

export function formatISODate(date) {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
}
