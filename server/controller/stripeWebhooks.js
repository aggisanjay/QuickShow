import stripe from 'stripe';
import Booking from '../models/Booking.js';
import { inngest } from '../inngest/index.js';

export const stripeWebhooks=async(request,resposne)=>{
    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
    const sig=request.headers['stripe-signature'];

    let event;
    try {
        event=stripeInstance.webhooks.constructEvent(request.body,sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
       return resposne.status(400).send(`Webhook Error: ${error.message}`); 
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent=event.data.object;
                const sessionList=await stripeInstance.checkout.sessions.list({
                    payment_intent:paymentIntent.id,
                    
                })
                const session=sessionList.data[0];
                const {bookingId}=session.metadata;

                await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentLink:""})
                //send confirmation Email
                await inngest.send({
                    name:'app/show.booked',
                    data:{bookingId}
                })
              
                 break;
            }
               
           
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        resposne.json({received:true})
    } catch (error) {
        console.error("Webhook processing error:",error);
        resposne.status(500).send('Internal Server Error');
    }
}
