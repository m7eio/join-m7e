import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-optionsread more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

let jwtCache = '';

export default async function handler(req, res) {
  await cors(req, res);
  const { method, body } = req;

  const submit = async (jwt) => {
    try {
      return fetch('https://form.nft4metaverse.io/m7e-invite/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jwt-token': jwt,
        },
        body: JSON.stringify({
          data: {
            content: JSON.stringify(body),
          },
        }),
      });
    } catch (err) {
      console.log('form parse error', err);
    }
  };

  if (method === 'POST') {
    const result = await submit(
      jwtCache ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxMzYxMGNmZDM5NDdmM2ZiNDIwMjNlMiJ9LCJmb3JtIjp7Il9pZCI6IjYxMzYwZjljYjM1YTY5NDAxMGRiZWIxMCJ9LCJpYXQiOjE2MzA5MzM0MDUsImV4cCI6MTYzMDk0NzgwNX0.TWqyuiYHXZ79CKrQNRE0hjAfJaCkHRa5TQsnYdc6T19',
    );

    const { status } = result;
    console.log('status', status);
    if (status < 200 || status >= 300) {
      console.log('re login');
      const { headers } = await fetch('https://form.nft4metaverse.io/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email: 'public@nft4metaverse.io',
            password: 'public@nft4metaverse.io',
          },
        }),
      });

      const jwt = headers.get('x-jwt-token');
      jwtCache = jwt;

      await submit(jwt);
    }

    res.status(200).json({
      message: 'Form submitted',
      data: body,
    });
  }
}
