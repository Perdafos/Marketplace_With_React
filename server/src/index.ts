import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';

dotenv.config();

const app = express();
app.use(cors());
// keep JSON parser for regular routes; webhook route uses raw body inside orders route when needed
app.use(express.json());

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Eclat API' }));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));

// global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
	console.error('Unhandled error:', err);
	res.status(err?.status || 500).json({ error: err?.message || 'internal error' });
});
