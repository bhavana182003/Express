const express = require('express');
const app = express();
app.set('view engine','ejs');//personalized webpages//embedded javascript to render views
app.set('views','./views');
app.get('/',(req,res)=>
{
    const data ={title:'Hello world!',message:'Welcome to Express'};
    res.render('index',data);
});
app.listen(3000, () => {
    console.log('App is running on port 3000');
})

