import { Request, Response, Router } from 'express';
import { WalletController } from '../controllers/WalletController';

export const walletRouter = Router();

walletRouter.get('/', async (req: Request, res: Response) => {
  const controller = new WalletController(req, res);
  return controller.getWalletInfo();
});

walletRouter.get('/balance', async (req: Request, res: Response) => {
  const controller = new WalletController(req, res);
  return controller.getBalance();
});
