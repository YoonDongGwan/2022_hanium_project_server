const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');


router.use(express.urlencoded({extended:false}));
router.use(bodyParser.json());
connection.connect();


router.get('/location', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM DeliveryLocation ORDER BY id'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                // let location = {
                //     'name' : result[i].LocationNum + ' ' + result[i].name,
                // };
                data.push(result[i].LocationNum + ' ' + result[i].name);
            }
        }

        res.json({
            'code' : resultCode,
            'message' : message, data
        });
    })
});

//현재 주문 인원
router.get('/nownum',function(req,res){
    const matchNum = req.query.matchNum
    const location = req.query.location
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT count(*) as nowNum FROM PreMatching where matchNum=? and location=?',[matchNum,location],(err,data)=>{
        if (err) {
            console.log(err);
        }else{
            resultCode = 200;
            message = "성공";
        }
        res.json(
            data[0]
        );
    });
});

//배달 주문
router.post('/prematching', (req, res) =>{
    const body = req.body;
    const totalPrice = body.totalPrice;
    const matchNum = body.matchNum;
    const location = body.location;
    const UID = body.UID;
    const deliveryTip = body.deliveryTip;
    const storeName2 = body.storeName2;
    const deliveryFood = body.deliveryFood;

    connection.query('select name from USERS where UID=?', [UID], (err, data)=>{
        if(err){
            console.log('회원가입 실패');
            res.status(200).json(
                {
                    "message" : false
                }
            );

        }else{
            connection.query('insert into PreMatching(name,totalPrice, matchNum,location,deliveryTip,storeName2,deliveryFood) values(?,?,?,?,?,?,?)', [data[0].name,totalPrice,matchNum,location,deliveryTip,storeName2,deliveryFood]);
            res.status(200).json({
                'message' : true,
                'name' : data[0].name
            });
        }

    });
});

router.get('/chat',function(req,res){
    const name = req.query.name
    var resultCode = 404;
    var message = '에러가 발생했습니다.'
    var sql = 'SELECT store, location, date, state, chatId FROM ProjectDB.OrderList WHERE name = ? ORDER BY chatId DESC LIMIT 1'

    connection.query(sql, name, (err,result)=>{

        if (err) {
            console.log(err);
        }else{
            resultCode = 200;
            message = "성공";
        }
        res.json({
            'code': resultCode,
            'message': message,
            'store' : result[0].store,
            'location' : result[0].location,
            'date' : result[0].date,
            'state' : result[0].state,
            'chatId' : result[0].chatId
        });
    });
});


router.post('/pay', function (req, res){
    const storeName2 = req.body.storeName2;
    const name = req.body.userName;
    const matchNum1 = req.body.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.body.location;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'



    var sql = 'UPDATE PreMatching SET state="finish" WHERE matchNum=? and storeName2=? and location=? and name=?'

    connection.query(sql,[matchNum,storeName2,location,name],function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'name' : result[i].name,
                    'state' : result[i].state,
                    'deliveryTip' : result[i].deliveryTip,
                    'totalPrice' : result[i].totalPrice
                };
                data.push(food);
            }
        }

        res.json({
            'code' : resultCode,
            'message' : message, data
        });
    })
});


router.post('/get_people', function (req, res){
    const storeName2 = req.body.storeName2;
    const matchNum1 = req.body.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.body.location;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'



    var sql = 'SELECT * From PreMatching WHERE matchNum=? and storeName2=? and location=?'

    connection.query(sql,[matchNum,storeName2,location],function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'name' : result[i].name,
                    'state' : result[i].state,
                    'deliveryTip' : result[i].deliveryTip,
                    'totalPrice' : result[i].totalPrice
                };
                data.push(food);
            }
        }

        res.json({
            'code' : resultCode,
            'message' : message, data
        });
    })
});



router.post('/cancel', function (req, res){

    var resultCode = 404;
    var message = '에러가 발생했습니다.'
    const storeName2 = req.body.storeName2;
    const name = req.body.userName;
    const matchNum1 = req.body.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.body.location;

    connection.query('delete from PreMatching where name=? and location=? and storeName2=? and matchNum=?', [name,location,storeName2,matchNum], function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';


        }

        res.json({
            'code' : resultCode,
            'message' : message
        });
    })
});


router.post('/chk_match', function (req, res){
    const storeName2 = req.body.storeName2;
    const name = req.body.userName;
    const matchNum1 = req.body.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.body.location;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'
    let count = 0;



    var sql = 'SELECT count(*) as cnt From PreMatching WHERE matchNum=? and storeName2=? and location=? and state="finish"'

    connection.query(sql,[matchNum,storeName2,location],function(err, sum){
        if (err){
            console.log(err);
        }else{
            //두번쨰쿼리
            var nextChatId = 0
            if(sum[0].cnt==matchNum){
                connection.query('SELECT MAX(chatId) as chatId FROM OrderList', function (err, result){
                    if (err){
                        console.log(err)
                    }
                    else{
                        nextChatId = result[0].chatId + 1
                    }
                })
                var sql2 = 'SELECT * FROM PreMatching WHERE matchNum=? and storeName2=? and location=? '
                connection.query(sql2,[matchNum,storeName2,location],function (err,result){
                    if (err){
                        console.log(err);
                    }
                    else{

                        resultCode = 200;
                        message = '성공';
                        var data = [];
                        for(let i = 0; i < result.length; i++){
                            let tName = result[i].name;
                            let tStore = result[i].storeName2;
                            let tDeliveryFood = result[i].deliveryFood;
                            let tPrice = result[i].totalPrice;

                            var sql3 = 'INSERT INTO OrderList(name,store,deliveryFood,price,state,matchNum,location, chatId) VALUES(?,?,?,?,"결제 완료",?,?,?)'
                            connection.query(sql3,[tName,tStore,tDeliveryFood,tPrice,matchNum,location, nextChatId],function (err,end){
                                if (err){
                                    console.log(err);
                                }
                                else{

                                    var sql4 = 'DELETE FROM PreMatching WHERE name=? AND matchNum=? AND storeName2=? AND location=?'
                                    connection.query(sql4,[tName,matchNum,tStore,location],function (err,en2){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{

                                            if(count==1){
                                                res.json({

                                                    'code' : resultCode,
                                                    'message' : message
                                                });
                                            }
                                            count++;

                                        }
                                    })

                                    // res.json({
                                    //     'code' : resultCode,
                                    //     'message' : message
                                    // });
                                }

                                //세번쨰 퀄리끝
                            })
                        }


                    }

                    //두번쨰쿼리끝
                })

            }
            else{


            }


        }


    })
});


router.post('/start_chat', function (req, res){
    const storeName2 = req.body.storeName2;
    const matchNum1 = req.body.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.body.location;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT count(*) as Cnt From OrderList WHERE matchNum=? and store=? and location=?'

    connection.query(sql,[matchNum,storeName2,location],function(err, result){
        if (err){
            console.log(err);
        }else{
            if(result[0].Cnt!=0){
                resultCode = 200;
                message = '성공';
            }

        }

        res.json({
            'code' : resultCode,
            'message' : message
        });
    })
});

module.exports = router;

