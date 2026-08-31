import type { Express, Request, Response } from 'express';

const express = require('express');
const cors = require('cors');
const app: Express = express();

app.use(cors()); 

app.get(process.env.SUPABASE_URL + '/projects', (req: Request, res: Response) => {
  res.send({ projects: [
    { name: 'GovStack', description: 'An Umbraco CMS product. Utilizing C#.NET and VueJS.' },
    { name: 'Harley Davidson Cebu(RDAK)', description: 'An e-service software for Harley Davidson dealers. Utilizing ReactJS, React Native and Java Springboot.' },
    { name: 'Alliance WebPOS', description: 'A web-based point-of-sale system. Utilizing ReactJS, React Native and PHP Laravel.' }
  ] });
});

app.listen(3001);