export default function getPercent(a: number, b: number) {
  return b > 0 ? Math.round((a / b) * 100) : 0;
}
