export default function getPercent(value: any, totalValue: any) {
    return Number(((value/totalValue) * 100).toFixed());
}