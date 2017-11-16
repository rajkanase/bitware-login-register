const User=require('../models/user');
const mongoose=require('mongoose');
const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const secret=require('crypto').randomBytes(256).toString('hex');



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


// router.get('/checkEmail/:email',(req,res)=>{
//     let x=req.params.email;
//     res.send(x);
// });


router.get('/checkEmail/:email',(req,res)=>{
    res.send(req.params.email);
    if(!req.params.email){
        res.json({success:false,message:'Email was not provided'});
    }else{
        User.findOne({email: req.params.email},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(user){
                    res.json({success:false,message:'Email is already taken.'});
                }else{
                    res.json({success:true,message:'Email is available.'});
                }
            }
        });
    }
});

router.get('/checkUsername/:username',(req,res)=>{
    if(!req.params.username){
        res.json({success:false,message:'Username was not provided'});
    }else{
        User.findOne({username: req.params.username},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(user){
                    res.json({success:false,message:'Username is already taken.'});
                }else{
                    res.json({success:true,message:'Username is available.'});
                }
            }
        });
    }
});

// router.post('/login',(req,res)=>{
//     if(!req.body.username){
//         res.json({success:false,message:'Username was not provided'});
//     }else{
//         if(!req.body.password){
//             res.json({success:false,message:'Password was not provided'});
//         }else{
//             User.findOne({username: req.body.username} && {password: req.body.password},(err,user)=>{
//                 if(err){
//                     res.json({success:false,message:err});
//                 }else{
//                     // res.send(user);
//                     res.json({success:true,message:'Success'}); 
//                 }
//             });
//         }
//     }
// });


router.post('/login',(req,res)=>{
    if(!req.body.username){
        res.json({success:false,message:'Username was not provided'});
    }else{
        if(!req.body.password){
            res.json({success:false,message:'Password was not provided'});
        }else{
            User.findOne({username: req.body.username.toLowerCase()},(err,user)=>{
                if(err){
                    res.json({success:false,message: err});
                }else{
                    if(!user){
                        res.json({success:false,message:'Username not valid.'});
                    }else{
                        const validPassword = user.comparePassword(req.body.password);
                        if(!validPassword){
                            res.json({success:false,message:'Password invalid'});
                        }else{
                            const token=jwt.sign({ userId: user._id}, secret, {expiresIn:'24h'});
                            res.json({success:true,message:'Success', token: token, user:{username:user.username}});
                        }
                    }
                }
            });
        }
    }
});

router.use((req,res,next)=>{
    const token= req.headers['authorization'];

    if(!token){
        res.json({ success: false, message: 'No token provided'});
    }else{
        jwt.verify(token, secret, (err,decoded)=>{
            if(err){
                res.json({ success: false, message: 'Token Invalid:'+ err});
            }else{
                req.decoded=decoded;
                next();
            }
        })
    }
});


router.get('/profile',(req,res)=>{
    User.findOne({ _id:req.decoded.userId}).select('username email').exec((err,user)=>{
        if(err){
            res.json({ success: false, message: err});
        }else{
            if(!user){
                res.json({ success: false, message: 'User not found.'});
            }else{
                res.json({ success: true, user:user});
            }
        }
    })
})



module.exports=router;

