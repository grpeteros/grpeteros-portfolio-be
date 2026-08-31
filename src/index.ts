import express, { type Express, type Request, type Response } from 'express';
import { createClient } from "@supabase/supabase-js";

// const express = require('express');
import cors from 'cors';
const app: Express = express();

// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);

app.use(cors());
app.get('/projects', (req: Request, res: Response) => {
  res.send({
    projects: [
      { name: 'GovStack', description: 'An Umbraco CMS product. Utilizing C#.NET and VueJS.' },
      { name: 'Harley Davidson Cebu(RDAK)', description: 'An e-service software for Harley Davidson dealers. Utilizing ReactJS, React Native and Java Springboot.' },
      { name: 'Alliance WebPOS', description: 'A web-based point-of-sale system. Utilizing ReactJS, React Native and PHP Laravel.' }
    ]
  });
});

app.listen(3001);