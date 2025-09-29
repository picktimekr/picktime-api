import express, { Request, Response } from 'express';

const app = express();
const port = 3003;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
