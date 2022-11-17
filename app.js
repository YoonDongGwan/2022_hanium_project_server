const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const foodRouter = require('./routes/foods');
const storeRouter = require('./routes/store');
const deliveryRouter = require('./routes/delivery');
const offlineRouter = require('./routes/offline');


app.use('/user', userRouter);
app.use('/foods', foodRouter);
app.use('/store', storeRouter);
app.use('/delivery', deliveryRouter);
app.use('/offline', offlineRouter);

app.listen(3000, '172.31.1.63', function () {
    console.log('서버 실행 중...');
});

