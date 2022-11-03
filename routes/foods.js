const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');

connection.connect();
router.use(bodyParser.json());


router.get('/ranking', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM Foods ORDER BY count DESC LIMIT 10'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'name' : result[i].name,
                    'company' : result[i].company,
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

router.get('/chicken', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM ChickenStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/pizza', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM PizzaStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/hamburger', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM HamburgerStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/chinese', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM ChineseStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/western', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM WesternStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/school', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM SchoolStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

router.get('/other', function (req, res){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    var sql = 'SELECT * FROM OtherStores'
    connection.query(sql, function(err, result){
        if (err){
            console.log(err);
        }else{
            resultCode = 200;
            message = '성공';
            var data = [];
            for(let i = 0; i < result.length; i++){
                let food = {
                    'id' : result[i].id,
                    'name' : result[i].name,
                    'minPrice' : result[i].minPrice,
                    'deliveryTip' : result[i].deliveryTip,
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

module.exports = router;