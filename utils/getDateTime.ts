// returns formatted date or time reliably across Date objects, ISO strings, timestamps, or date strings

export function getDateSliced(dateInput: Date | string | number): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
        return String(dateInput);
    }
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }); // e.g. "12 Oct 2026"
}

export function getDateTimeSliced(dateInput: Date | string | number): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
        return "";
    }
    return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }); // e.g. "02:45 AM"
}