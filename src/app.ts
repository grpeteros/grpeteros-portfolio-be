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
app.use(express.json());
app.get('/projects', async (req: Request, res: Response) => {
  let { data: projects, error } = await supabase
    .from('projects')
    .select('*');
  res.send({
    projects: projects?.sort((a, b) => a.id - b.id) ?? []
  });
});
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World Test!');
});
app.get('/products', async (req: Request, res: Response) => {
  // console.log(`Received request for product: ${productName}`);
  let { data: products, error } = await supabase
    .from('products')
    .select('*');

    console.log('products:', products);
  res.send({
    products: products
  });

});
app.get('/products/:name', async (req: Request, res: Response) => {
  const productName = req.params.name; // Capture the value
  // console.log(`Received request for product: ${productName}`);
  let { data: product, error } = await supabase
    .from('products')
    .select('*').like('product_name', `%${productName}%`);
  res.send({
    product: product
  });

});

app.post('/cart/finish', async (req: Request, res: Response) => {
  let request = req.body;
  console.log('Received request for cart finish:', request);
  let total_price = 0.0
  request.cart.forEach((product: any) => {
    total_price += product.product_price * product.product_quantity;
  });

  console.log('Total price calculated:', total_price);

  let { error } = await supabase
    .from('transactions')
    .insert({ products: (request.cart), total_price: total_price });

  if (error) {
    console.error('Error inserting transaction:', error);
  }

  res.send('Transaction completed successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});