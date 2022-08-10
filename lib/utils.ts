let _uidCount = 1;
export const genuid = () => {
  return _uidCount++;
};


/**
 * 将字符串使用 0 补到 6 位长度
 */
export const padRight = (str: string, pad: string, num: number) => {
  return str.padStart(num, pad);
};
