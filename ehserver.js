const express = require('express');
const app = express();

app.get('/', (req, res) => {
    throw new Error('Something went wrong!');
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}
);
app.listen(3000, () => {
    console.log('App is running on port 3000');
})
app.use((req, res, next) => {
    res.status(404).send('Page not found!!!!');
    
});
