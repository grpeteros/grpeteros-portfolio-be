import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import ExcelJS from 'exceljs';


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
  let { data: products, error } = await supabase
    .from('products')
    .select('*');
  res.send({
    products: products
  });

});
app.get('/products/:name', async (req: Request, res: Response) => {
  const productName = req.params.name; // Capture the value
  let { data: product, error } = await supabase
    .from('products')
    .select('*').like('product_name', `%${productName}%`);
  res.send({
    product: product
  });

});
app.get('/sales', async (req: Request, res: Response) => {
  let { data: sales, error } = await supabase
    .from('transactions')
    .select('*').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .lte('created_at', new Date().toISOString());
  res.send({
    transactions: sales
  });

});

app.get('/sales/print', async (req: Request, res: Response) => {
  let { data: sales, error } = await supabase
    .from('transactions')
    .select('*').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .lte('created_at', new Date().toISOString());

  let sortedData = sales?.sort((a: any, b: any) => b.id - a.id)

  let total_price = 0.0
  let workbook = new ExcelJS.Workbook()
  let worksheet = workbook.addWorksheet('transactions')
   worksheet.columns = [
    { header: 'Date', key: 'created_at', width: 20 },
    { header: 'Products', key: 'products', width: 30 },
    { header: 'Total Price', key: 'total_price', width: 20 },
  ];

  sortedData?.map((transaction) => {
    transaction.products = transaction.products.map((product: any) => {
      return `${product.product_name} (x${product.product_quantity})`;
    });
    total_price += transaction.total_price;
    worksheet.addRow({ created_at: new Date(transaction.created_at).toLocaleDateString(), products: JSON.stringify(transaction.products), total_price: transaction.total_price });
  });


  worksheet.addRow({ products: 'Total:', total_price: total_price });

  res.setHeader('Content-Disposition', 'attachment; filename='  + encodeURIComponent('transactions.xlsx'));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
  await workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
});

app.post('/cart/finish', async (req: Request, res: Response) => {
  let request = req.body;
  let total_price = 0.0
  request.cart.forEach((product: any) => {
    total_price += product.product_price * product.product_quantity;
  });

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