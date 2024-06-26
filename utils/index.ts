
export function toMilliunits(amount) {
  return amount * 1000;
}

// Function to convert from milliunits to units
export function formatMilliunits(milliunits) {
  return milliunits / 1000;
}
export const formatedPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// export function formatDate(inputDateString: string): string {
//   const inputDate = new Date(inputDateString);
//   const today = new Date();

//   if (
//     inputDate.getDate() === today.getDate() &&
//     inputDate.getMonth() === today.getMonth() &&
//     inputDate.getFullYear() === today.getFullYear()
//   ) {
//     // If the date is today, show only hours and minutes
//     const options: Intl.DateTimeFormatOptions = {
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Intl.DateTimeFormat("en-US", options).format(inputDate);
//   } else {
//     // If the date is not today, show the full date
//     const options: Intl.DateTimeFormatOptions = {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Intl.DateTimeFormat("en-US", options).format(inputDate);
//   }
// }
