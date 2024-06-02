const  express = require('express');
const app = express();
const logger = (req,res,next) =>{
    console.log(`${req.method} request for '${req.url}'`);
    next();
};
app.use(logger);
app.get('/',(req,res)=>{
    res.send('Hello World!!!!');
});
app.listen(3000,()=>{
    console.log('listening on port 3000');
})
