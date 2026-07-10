import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from 'cors'
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";
import { GearRoutes } from "./modules/gear/gear.route";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { CategoryRoutes } from "./modules/category/category.route";
import { ProviderRoutes } from "./modules/provider/provider.route";
import { AdminRoutes } from "./modules/admin/admin.route";


const app: Application = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: config.app_url,
    credentials: true
}))


app.get('/', (req: Request, res: Response) => {
    res.send("GearUp Backend API is running.")
})

app.use('/api/auth', authRoutes);
app.use('/api/gear', GearRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/provider', ProviderRoutes);
app.use('/api/admin', AdminRoutes);
// app.use('/api/rentals', RentalRoutes);
// app.use('/api/payments', PaymentRoutes);
// app.use('/api/reviews', ReviewRoutes);


app.use(notFound);
app.use(globalErrorHandler);
export default app;