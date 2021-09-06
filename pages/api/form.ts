export default async function handler(req, res) {
  const { method, body } = req;

  if (method === 'POST') {
    console.log(body);
    await fetch('https://form.nft4metaverse.io/join-m7e/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-jwt-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxMzRjZGQ3NDI0YjcwNjQzZTIzYjNlYiJ9LCJmb3JtIjp7Il9pZCI6IjYxMzRjNTA1OTcxNGVmM2FhOTU1MWMxZiJ9LCJpYXQiOjE2MzA4NTE1MzIsImV4cCI6MTYzMDg2NTkzMn0.NHtQqU0-xtqPAM6WNcp386UU5wRmgYClq7BYj0mVw9g',
      },
      body: JSON.stringify({
        data: body
      }),
    });

    res.status(200).json({
      message: 'Form submitted',
      data: body,
    });
  }
}
