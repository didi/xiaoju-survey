import fetch from 'node-fetch';

export const httpPost = async ({ url, body }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
};
