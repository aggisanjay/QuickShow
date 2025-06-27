

//function to check availability of selected seats for a movie

import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from "stripe"

const checkSeatsAvailability=async(showId,selectedSeats)=>{
    try {
      const showData=  await Show.findById(showId)
      if(!showData) return false;

      const occupiedSeats=showData.occupiedSeats;
      const isAnySeatTaken=selectedSeats.some(seat=>occupiedSeats[seat]);
      return !isAnySeatTaken
    } catch (error) {
        console.log(error.message)
        return false
        
    }
}

export const createBooking=async(req,res)=>{
    try {
       const {userId}=req.auth();
       const {showId,selectedSeats}=req.body;
       const {origin}=req.headers;

       //check if the seat is available for the selected show
       const isAvailable=await checkSeatsAvailability(showId,selectedSeats)
       if(!isAvailable){
        return res.json({success:false,message:"Selected Seats are not available."})
       }
       // get the show details

       const showData=await Show.findById(showId).populate('movie');

       //create new Booking
       const booking=await Booking.create({
        user:userId,
        show:showId,
        amount:showData.showPrice*selectedSeats.length,
        bookedSeats:selectedSeats
       })
       selectedSeats.map((seat)=>{
        showData.occupiedSeats[seat]=userId;
       })
       showData.markModified('occupiedSeats');

       await showData.save();

       //stripe gateway Initialize
       const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
       
       //creating line items  to for stripe

       const line_items=[{
        price_data: {
          currency:"inr",
          product_data: {
            name:showData.movie.title,
            
          },
          unit_amount:Math.floor(booking.amount)*100
        },
        quantity:1
       }]

       //creating checkout session
       const session=await stripeInstance.checkout.sessions.create({
         success_url:`${origin}/loading/my-bookings`,
         cancel_url:`${origin}/my-bookings`,
         mode:"payment",
         line_items,
         metadata:{bookingId:booking._id.toString()},
         expires_at:Math.floor(Date.now()/1000)+30*60
       })
       booking.paymentLink=session.url;
       await booking.save();
       //run inngest shedular function to check payment status after 10 minutes

       await inngest.send({
        name:'app/checkpayment',
        data:{bookingId:booking._id.toString()}
       })
       res.json({success:true,url:session.url})


    } catch (error) {

        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}

export const getOccupiedSeats=async(req,res)=>{
    try {
        const{showId}=req.params;
        const showData=await Show.findById(showId)
        const occupiedSeats=Object.keys(showData.occupiedSeats)
        res.json({success:true,occupiedSeats})

        
    } catch (error) {
         console.log(error.message);
        res.json({success:false,message:error.message})
    }
}