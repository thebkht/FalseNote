export function formatNumberWithSuffix(num: number): string {
     //if number as 
     //format number with suffix ex: 1.5K, 2.3M, 4.5B
     //if number is 0 or NaN return 0
     if (isNaN(num) || num === 0) {
       return "0";
     } else{
       const suffixes = ["", "K", "M", "B", "T"];
       const magnitude = Math.floor(Math.log10(num) / 3);
       const divisor = Math.pow(10, magnitude * 3);
       const suffix = suffixes[magnitude];
       const roundedNum = Math.round(num / divisor * 10) / 10;
       return `${roundedNum}${suffix}`;
     }
   }