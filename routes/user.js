const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');

router.use(express.urlencoded({extended:false}));
router.use(bodyParser.json());
connection.connect();


router.get('/', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM USERS'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '내 이름은 ' + result[0].name;
        }
        res.json({
            'code' : resultCode,
            'message' : message
        });
    })
});

//회원가입
router.post('/signup', (req, res) =>{
    const body = req.body;
    const name = body.name;
    const id = body.id;
    const password = body.password;
    const school = body.school;
    const major = body.major;


    connection.query('select * from USERS where id=?',[id],(err,data)=>{
        if(data.length == 0){
            console.log("성공")
            console.log(req.body);
            connection.query('insert into USERS(name,id, password,school,major) values(?,?,?,?,?)',[name,id,password,school,major]);
            res.status(200).json(
                {
                    "message" : true
                }
            );
        }else{
            console.log('회원가입 실패');
            res.status(200).json(
                {
                    "message" : false
                }
            );

        }

    });
});


//로그인
router.post('/login', (req, res)=>{
    const body = req.body;
    const id = body.id;
    const password = body.password;

    connection.query('select id, password from USERS where id=? and password=?', [id,password], (err, data)=>{
        if(data.length == 0){ // 로그인 실패
            console.log('로그인 실패');
            res.status(200).json(
                {
                    "UID" : -1
                }
            )
        }
        else{
            // 로그인 성공
            console.log('로그인 성공');
            connection.query('select UID from USERS where id=?',[id],(err,data)=>{
                res.status(200).json(
                    data[0]
                )
            });
        }
    });
});


//마이페이지
router.get('/mypage',(req,res)=>{
    const UID = req.query.UID;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT school,major,name,id FROM USERS where UID=?',UID, (err, data)=>{
        if (err) {
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
        }
        res.json(
            data[0]
        );
    });
});


//주문 내역
router.get('/orderlist', function (req, res){
    const id = req.query.id;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT * from OrderList where id=?', id, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let list = {
                    'id' : result[i].id,
                    'store' : result[i].store,
                    'date' : result[i].date,
                    'deliveryFood' : result[i].deliveryFood,
                    'price' : result[i].price
                };
                data.push(list);
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

    connection.query('SELECT count(*) FROM PreMatching where matchNum=? and location=?',[matchNum,location],(err,data)=>{
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



module.exports = router;

