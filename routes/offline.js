const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');

connection.connect();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));



router.get('/get_data', function (req, res){
    // const company = req.query.company;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM OfflineData;'

    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'lat' : result[i].lat,
                    'lon' : result[i].lon,
                    'title' : result[i].title,
                    'snippet' : result[i].snippet,
                    'alpha' : result[i].alpha,
                    'tag' : result[i].tag,
                    'content' : result[i].content
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


router.post('/put_data', function (req, res){

    const content = req.body.content;
    const title = req.body.title;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'


    var sql = 'UPDATE OfflineData SET alpha = 0.98 , content=? WHERE title =?;'


    connection.query(sql,[content ,title],function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'lat' : result[i].lat,
                    'lon' : result[i].lon,
                    'title' : result[i].title,
                    'snippet' : result[i].snippet,
                    'alpha' : result[i].alpha,
                    'tag' : result[i].tag,
                    'content' : result[i].content
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


// 사용x
router.post('/update', function (req, res){


    const title = req.query.title;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'


    var sql = 'UPDATE OfflineData SET alpha = 1.0 , content=null WHERE title =?;'


    connection.query(sql,[title],function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'lat' : result[i].lat,
                    'lon' : result[i].lon,
                    'title' : result[i].title,
                    'snippet' : result[i].snippet,
                    'alpha' : result[i].alpha,
                    'tag' : result[i].tag,
                    'content' : result[i].content
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












router.post('/asd', function (req, res){
    const storeName2 = req.query.storeName2;
    const name = req.query.userName;
    const matchNum1 = req.query.matchNum;
    const matchNum = parseInt(matchNum1);
    const location = req.query.location;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'



    var sql = 'SELECT count(*) as cnt From PreMatching WHERE matchNum=? and storeName2=? and location=? and state="finish"'

    connection.query(sql,[matchNum,storeName2,location],function(err, sum){
        if (err){
            console.log(err);
        }else{
            //두번쨰쿼리
            if(sum[0].cnt==matchNum){
                console.log(sum);
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

                            var sql3 = 'INSERT INTO OrderList(name,store,deliveryFood,price,state,matchNum,location) VALUES(?,?,?,?,"결제 완료",?,?)'
                            connection.query(sql3,[tName,tStore,tDeliveryFood,tPrice,matchNum,location],function (err,end){
                                if (err){
                                    console.log(err);
                                }
                                else{
                                    res.json({
                                        'code' : resultCode,
                                        'message' : message
                                    });
                                }

                                //세번쨰 퀄리끝
                            })
                        }


                    }

                    //두번쨰쿼리끝
                })

            }
            else{
                console.log("오지마");


            }



        }


    })
});


module.exports = router;

