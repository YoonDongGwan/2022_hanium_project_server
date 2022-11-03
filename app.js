const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const foodRouter = require('./routes/foods')


app.use('/user', userRouter);
app.use('/foods', foodRouter);

app.listen(3000, 'xx.xx.x.xx', function () {
    console.log('서버 실행 중...');
});

