export const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    throw new Error(`parse error, ${(e as Error).message}`);
  }
};
