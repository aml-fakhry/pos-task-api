import express from 'express';
import cors from 'cors';

const PORT = 5000;
const app = express();

app.use(cors());
app.get('/products', (req, res) => {
  const products = [
    { id: 1, name: 'كولا زيرو', price: 100 },
    { id: 2, name: 'لبنه شنينة', price: 4.0 },
    { id: 3, name: 'بيبسي صغير', price: 5.0 },
  ];
  res.json(products);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
