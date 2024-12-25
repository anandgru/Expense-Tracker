const purchase=require('../controllers/purchase');
const {jwtAuthMiddleware}=require('../jwt');
const express=require('express');

const router=express.Router();

router.get('/premium', jwtAuthMiddleware, purchase.purchasePremium);
router.post('/updateOrder', jwtAuthMiddleware, purchase.updateOrderStatus);

module.exports=router;