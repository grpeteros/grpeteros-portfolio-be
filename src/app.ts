import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';


console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string || 
  '',
  process.env.VITE_SUPABASE_SECRET_KEY as string || ''
);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.get('/projects', async (req: Request, res: Response) => {
  let { data: projects, error } = await supabase
  .from('projects')
  .select('*')
  res.send({
      projects,
  });
});
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World Test!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});