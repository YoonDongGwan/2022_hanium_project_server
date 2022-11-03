const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/database.js');
const connection = mysql.createConnection(dbConfig);
const bodyParser = require('body-parser');

router.use(express.urlencoded({extended:false}));
router.use(bodyParser.json());
connection.connect();
//
// var UID=1;
// router.get('/', function (req, res){
//     var resultCode = 404;
//     var message = '에러가 발생했습니다.'
//
//     var sql = 'SELECT * FROM USERS'
//     connection.query(sql, function(err, result){
//         if (err){
//             console.log(err);
//         }else{
//             resultCode = 200;
//             message = '내 이름은 ' + result[0].name;
//         }
//         res.json({
//             'code' : resultCode,
//             'message' : message
//         });
//     })
// });
//
// //회원가입
// router.post('/signup', (req, res) =>{
//     const body = req.body;
//     const name = body.name;
//     const id = body.id;
//     const password = body.password;
//     const school = body.school;
//     const major = body.major;
//
//
//     connection.query('select * from USERS where id=?',[id],(err,data)=>{
//         if(data.length == 0){
//             console.log("성공")
//             console.log(req.body);
//             connection.query('insert into USERS(UID,name,id, password,school,major) values(?,?,?,?,?,?)',[UID,name,id,password,school,major]);
//             UID+=1
//             res.status(200).json(
//                 {
//                     "message" : true
//                 }
//             );
//         }else{
//             console.log('회원가입 실패');
//             res.status(200).json(
//                 {
//                     "message" : false
//                 }
//             );
//
//         }
//
//     });
// });
//
//
// //로그인
// router.post('/login', (req, res)=>{
//     const body = req.body;
//     const id = body.id;
//     const password = body.password;
//
//     connection.query('select id, password from USERS where id=? and password=?', [id,password], (err, data)=>{
//         if(data.length == 0){ // 로그인 실패
//             console.log('로그인 실패');
//             res.status(200).json(
//                 {
//                     "message" : false
//                 }
//             )
//         }
//         else{
//             // 로그인 성공
//             console.log('로그인 성공');
//             connection.query('select id from USERS where id=?',[id],(err,data)=>{
//                 res.status(200).send(data[0]);
//             });
//         }
//     });
// });


// //마이페이지
// router.post('/mypage',(req,res)=>{
//     const body = req.body;
//     const school = body.school;
//     const major = body.major;
//     const name = body.name;
//
//     connection.query('select id, password from USERS where id=? and password=?', [id,password], (err, data)=>{
//         if(data.length == 0){
//             console.log('실패');
//             res.status(200).json(
//                 {
//                     "message" : false
//                 }
//             )
//         }
//         else{
//             console.log('마이페이지');
//             connection.query('select school,major,name from USERS where school=? and major=? and name=? ',[school,major,name],(err,data)=>{
//                 res.status(200).send(data[0]);
//             });
//         }
//     });
// });

module.exports = router;

