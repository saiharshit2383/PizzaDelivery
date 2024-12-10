const User = require("../../models/user")
const bcrypt = require('bcrypt')
const passport = require("passport"); 
function authController(){
  return{
    login(req,res){
      res.render('auth/login')
    },
    postLogin(req,res,next){
      passport.authenticate('local',(err,user,info)=>{
        if(err){
          req.flash('error',info.message)
          return next(err)
        }
        if(!user){
          req.flash('error',info.message)
          return res.redirect('/login')
        }
        req.logIn(user, (err)=>{
          if(err){
            req.flash('error',info.message)
            return next(err)
          }

          return res.redirect('/')
        })
      })(req, res, next)
    },
    register(req,res){
      res.render('auth/register')
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
    
      // Validate request
      if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }
    
      try {
        // Check if email exists
        const emailExists = await User.exists({ email: email });
        if (emailExists) {
          req.flash('error', 'Email already taken');
          req.flash('name', name);
          req.flash('email', email);
          return res.redirect('/register');
        }
    
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a user
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
    
        await user.save();
    
        // Redirect to login after successful registration
        req.flash('success', 'Registration successful. Please log in.');
        return res.redirect('/login');
      } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again later.');
        return res.redirect('/register');
      }
    }
  }
    
}
module.exports=authController
