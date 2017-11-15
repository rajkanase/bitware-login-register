const User=require('../models/user');
const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();


const db="mongodb://localhost:27017/raj-demo";
mongoose.Promise=global.Promise;

mongoose.connect(db,(err)=>{
    if(err){
        console.log("Error !"+err);
    }
});

router.get('/',function(req,res){
    res.send('Api Works');
});


router.post('/register',(req,res)=>{
    if(!req.body.email){
        res.json({success:false,message:'You must provide an e-mail'});
    }else{
        if(!req.body.username){
            res.json({success:false,message:'You must provide a username'});
        }else{
            if(!req.body.mobile){
                res.json({success:false,message:'You must provide a mobile number'});
            }else{
                if(!req.body.password){
                    res.json({success:false,message:'You must provide a password'});
                }else{
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        mobile: req.body.mobile,
                        password: req.body.password
                    });
                    user.save((err)=>{
                        if(err){
                            if(err.code === 11000){
                                res.json({success:false,message:'E-mail or Username already exists..!'}); 
                            }else{
                                if(err.errors){
                                    if(err.errors.email){
                                        res.json({ success: false, message: err.errors.email.message});
                                    }else{
                                        if(err.errors.username){
                                        res.json({ success: false, message: err.errors.username.message});
                                             }else{
                                            if(err.errors.password){
                                                 res.json({ success: false, message: err.errors.password.message});
                                            }else{
                                                if(err.errors.mobile){
                                                    res.json({success: false, message: err.errors.mobile.message})
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    console.log(err);
                                    res.json({success:false,message:'Could not save user. Error:',err});
                                }                            
                            }
                        }else{
                            res.json({success:true,message:'User saved successfully !'});
                        }
                    });
                }
            }
        }
    }

});



module.exports=router;

