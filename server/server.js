import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controller/stripeWebhooks.js';
const app=express()
const port=3000;

await connectDB();

//stripe webhooks Route

app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)
//middleware

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//api routes

app.use('/api/show',showRouter);
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>res.send('Server is Live!'))
app.use('/api/inngest',serve({ client: inngest, functions }))
app.listen(port,()=>console.log(`Server is running on port http://localhost:${port}`))