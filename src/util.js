const NAP_DELAY = 5000;
const RETRY_DELAY = 10000;

export function nap(ms = NAP_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function poll(api, interval = RETRY_DELAY, retries = Infinity) {
  while (retries--) {
    const response = await api();
    if (response) {
      return response;
    }
    await nap(interval);
  }
  throw new Error('Maximum retries for polling reached');
}

export const formatNumber = val => {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  const options = {maximumFractionDigits: 8};
  return new Intl.NumberFormat(undefined, options).format(num);
};
