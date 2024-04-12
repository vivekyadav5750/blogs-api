const express = require('express');
const app = express();

const { connectUsingMongoose } = require('./config/mongoDB');


//connect DB
connectUsingMongoose()

const apiRoutes = require('./routes/apiRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(express.urlencoded({ extended: true }));    //can be commented
app.use(express.json());

app.use('/api', apiRoutes);
app.use(errorMiddleware.handleError);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

const PORT = 3200;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

