export default function getPercent(value: Number, totalValue: Number) {
    return Number(((value/totalValue) * 100).toFixed());
}