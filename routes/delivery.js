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

    connection.query('select name from USERS where UID=?', [UID], (err, data)=>{
        if(err){
            console.log('회원가입 실패');
            res.status(200).json(
                {
                    "message" : false
                }
            );

        }else{
            connection.query('insert into PreMatching(name,totalPrice, matchNum,location,deliveryTip) values(?,?,?,?,?)', [data[0].name,totalPrice,matchNum,location,deliveryTip]);
            res.status(200).json({
                'message' : true,
                'name' : data[0].name
            });
        }

    });
});

router.get('/chat',function(req,res){
    const name = '%' + req.query.name + '%'
    var resultCode = 404;
    var message = '에러가 발생했습니다.'
    var sql = 'SELECT * FROM ChatList WHERE participant LIKE ?'

    connection.query(sql, name, (err,result)=>{
        if (err) {
            console.log(err);
        }else{
            resultCode = 200;
            message = "성공";
            var data = [];
            for(let i = 0; i < result.length; i++){
                let chat = {
                    'name' : result[i].name,
                    'company' : result[i].company,
                    'location' : result[i].location,
                    'id' : result[i].id
                };
                data.push(chat);
            }
        }
        res.json({
            'code': resultCode,
            'message': message,
            data
        });
    });
});

module.exports = router;