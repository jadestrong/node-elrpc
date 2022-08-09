let _uidCount = 1;
export const genuid = () => {
  return _uidCount++;
};


export const padRight = (str: string, pad: string, num: number) => {
  return str.padEnd(num, pad);
};
