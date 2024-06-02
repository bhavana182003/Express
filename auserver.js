const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done)=>
{
    //your authentication logic goes here
    //for now, we'll just assume that the user exists, and if they do, the password is correct
    // if(username === 'admin' && password === 'admin')
    // {
    //     return done(null, {id: 1, username: 'admin'});
    // }
    // return done(null, false, {message: 'Invalid username or password'});
}));

app.use(passport.initialize());// passport initializes  middleware  
app.use(passport.session());//passport stores  and manage the authentication sessions middleware
app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', })
);
app.get('/logout', (req, res)=>
    {
        req.logout();
        res.redirect('/');
    });
    const isAdmin = (req, res, next)=>
        {
            
            if(req.isAuthenticated() && req.user.id === 1)
            {
                return next();
            }
            else
            {
                res.status(403).send('Access denied');  
            }
        };
        app.get('/admin', isAdmin, (req, res)=>
            {
                res.send('Welcome to admin area ' + req.user.username);
}
// passport.serializeUser((user, done)=>
//     {
//         done(null, user.id);
//     }
// )
