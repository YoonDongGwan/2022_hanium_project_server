\\\const express = require('express');
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

    connection.query('select UID, name from USERS where id=? and password=?', [id,password], (err, data)=>{
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
            res.status(200).json({
                'UID' : data[0].UID,
                'name' : data[0].name
            })
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
    const name = req.query.name;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT date,store,deliveryFood,price,state from OrderList where name=?', name, function(err, result){
        if (err){
            console.log(err);
        }else {
            resultCode = 200;
            message = result[0].state;
            var data = [];
            for (let i = 0; i < result.length; i++) {
                let list = {
                    'date': result[i].date,
                    'store': result[i].store,
                    'deliveryFood': result[i].deliveryFood,
                    'price': result[i].price
                };
                if (result[i].state == "배달 완료") {
                    data.push(list);
                }
            }
        }


        res.json({
            'code' : resultCode,
            'message' : message, data
        });
    })
});

//현재 진행중인 공동배달
router.get('/myprogress', function (req, res){
    const name = req.query.name;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT store,date,matchNum,state from OrderList where name=?', name, function(err, result){
        if (err){
            console.log(err);
        }else {
            resultCode = 200;
            message = '성공';
            var data = [];
            for (let i = 0; i < result.length; i++) {
                let list = {
                    'store': result[i].store,
                    'date': result[i].date,
                    'matchNum': result[i].matchNum
                };
                if (result[i].state != '배달 완료') {
                    data.push(list);
                }
            }
        }
        res.json(
            data[0]
        );
    })
});


//현재 진행중인 공동배달 리스트 값 받아오기
router.get('/progresslist', function (req, res){
    const store = req.query.store;
    const date = req.query.date;
    const matchNum = req.query.matchNum;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT name,state from OrderList where store=? and date=? and matchNum=?', [store,date,matchNum], function(err, result){
        if (err){
            console.log(err);
        }else {
            resultCode = 200;
            message = '성공';
            var data = [];
            for (let i = 0; i < result.length; i++) {
                let list = {
                    'name': result[i].name,
                    'state': result[i].state,
                };
                if (result[i].state != '배달 완료') {
                    data.push(list);
                }
            }
        }


        res.json({
            'code' : resultCode,
            'message' : message, data
        });
    })
});

//현재 진행중인 공동배달이 있는지 확인
router.get('/checkprogresslist', function (req, res){
    const name = req.query.name;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT date,store,deliveryFood,price,state from OrderList where name=?', name, function(err, result){
        if (err){
            console.log(err);
        }else {
            resultCode = 200;
            message = '성공';
            var data = [];
            var value=true
            for (let i = 0; i < result.length; i++) {
                let list = {
                    'date': result[i].date,
                    'store': result[i].store,
                    'deliveryFood': result[i].deliveryFood,
                    'price': result[i].price,
                };
                if (result[i].state != "배달 완료") {
                    data.push(list);
                }
            }
            if (data.length==0){
                value=false
            }
        }


        res.json({
            'code' : resultCode,
            'message' : message, value
        });
    })
});


//주문내역이 있었는지 확인
router.get('/checkorderlist', function (req, res){
    const name = req.query.name;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('SELECT date,store,deliveryFood,price,state from OrderList where name=?', name, function(err, result){
        if (err){
            console.log(err);
        }else {
            resultCode = 200;
            message = '성공';
            var data = [];
            var value=true
            for (let i = 0; i < result.length; i++) {
                let list = {
                    'date': result[i].date,
                    'store': result[i].store,
                    'deliveryFood': result[i].deliveryFood,
                    'price': result[i].price,
                };
                if (result[i].state == "배달 완료") {
                    data.push(list);
                }
            }
            if (data.length==0){
                value=false
            }
        }


        res.json({
            'code' : resultCode,
            'message' : message, value
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