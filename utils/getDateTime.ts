// returns date or time in specified format


export function getDateSliced(date: String) {
   return date.toString().slice(4,15); // date as dd/mm/yyy
}

export function getDateTimeSliced(date: String) {
    return (date.toString().slice(15,21)); // date as dd/mm/yyy
}