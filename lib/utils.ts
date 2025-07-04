export function formatNpr(price: number | string): string {
  const num = Number(price);
  if (isNaN(num)) return "Invalid Price";
  if (num === 0) return "0";

  const crore = 10000000;
  const lakh = 100000;
  const thousand = 1000;

  let result = "";

  if (num >= crore) {
    const crores = Math.floor(num / crore);
    result += `${crores} Crore `;
    const remainder = num % crore;
    if (remainder >= lakh) {
      const lakhs = Math.floor(remainder / lakh);
      result += `${lakhs} Lakh`;
    }
    return result.trim();
  }

  if (num >= lakh) {
    const lakhs = Math.floor(num / lakh);
    result += `${lakhs} Lakh `;
    const remainder = num % lakh;
    if (remainder >= thousand) {
      const thousands = Math.floor(remainder / thousand);
      result += `${thousands} Thousand`;
    }
    return result.trim();
  }

  return num.toLocaleString('en-IN');
}
