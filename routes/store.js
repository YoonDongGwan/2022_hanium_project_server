const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');

connection.connect();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//가게에서 메뉴 확인
router.get('/menu', function (req, res){
    const company = req.query.company;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT name, price, imgUrl FROM Foods WHERE company=?;'

    connection.query(sql, company, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'name' : result[i].name,
                    'price' : result[i].price,
                    'imgUrl' : result[i].imgUrl
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




router.get('/offline', function (req, res){
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

module.exports = router;