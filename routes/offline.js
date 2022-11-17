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



router.post('/temp', function (req, res){
    const UID = req.body.UID;
    var resultCode = 404;
    var message = '에러가 발생했습니다.'

    connection.query('delete from PreMatching where name=?', UID, function(err, result){
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










module.exports = router;
