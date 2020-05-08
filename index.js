/*
All Imports
*/
const express= require('express');
const path= require('path');
const request= require('request');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const cheerio= require('cheerio');
const fs= require('fs');
const archiver = require('archiver');
const { zip } = require('zip-a-folder');

const app= express();

/*
Setting View Engine
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

/*

*/
app.post("/postSubmissions", (req,res,next) =>{
    var total=0,ac=0, wrong=0, tle=0, runtime=0, memorylimit=0, other=0, compilation=0, hacked=0, done=0, maxRatingQuestion=0;
    var nick= req.body.nick;
    handle= nick.toString();
    nick= nick.split(/\s/).join('');
    const url= 'https://codeforces.com/api/user.status?handle='+nick;       
    return rp(url, (err, res, body) => {
        done= done+1;
        if(res.statusCode===400){
            done=1;
            console.log("Invalid UserId!");
        }
        else if(res.statusCode===200){
            done= done+1;
            var jsonObject = JSON.parse(body);
            var result= jsonObject.result;
            let probMap = new Map();
           
            result.forEach((solution) => {
                total= total+1;
                if(solution.verdict==="OK"){
                    var rating= solution.problem.rating;
                    if(maxRatingQuestion<rating){
                        maxRatingQuestion= rating;
                    }
                    var id= solution.id;
                    var contestId= solution.contestId;
                    var problemName= solution.problem.name.split(/\s/).join('').replace(/[^a-zA-Z ]/g, "");
                    if(!probMap.has(problemName)){                    
                        ac= ac+1;
                        probMap.set(problemName, 1);
                        var solutionUrl= "https://codeforces.com/contest/" + contestId + "/submission/"+id;
                    }
                }
                else if(solution.verdict==="WRONG_ANSWER"){
                    wrong= wrong+1;
                }
                else if(solution.verdict==="TIME_LIMIT_EXCEEDED"){
                    tle= tle+1;
                }
                else if(solution.verdict==="RUNTIME_ERROR"){
                    runtime= runtime+1;
                }
                else if(solution.verdict==="MEMORY_LIMIT_EXCEEDED"){
                    memorylimit= memorylimit+1;
                }
                else if(solution.verdict==="COMPILATION_ERROR"){
                    compilation= compilation+1;
                }
                else if(solution.verdict==="CHALLENGED"){
                    hacked= hacked+1;
                }
                else{
                    other= other+1;
                }
            });
        }
    })
    .then((result) => {
        handle= "https://codeforces.com/profile/"+handle;
        var accuracy= 0;
        if(total!==0){
            accuracy= (ac/total)*100;
        }
        accuracy= accuracy.toFixed(2);
        res.render('home', { 
            URL: handle,
            total: total,
            accuracy: accuracy,
            ac: ac,
            tle: tle,
            wrong: wrong, 
            runtime:runtime, 
            memorylimit: memorylimit,
            compilation: compilation,
            hacked: hacked,
            other: other,
            quesRating: maxRatingQuestion,
            done: done
        });
    })
    .catch(err =>{
        console.log(err);
        res.redirect(350, '/');
    });
});

// app.post('/downloadSubmissions', (req, res, next) => {
//     done=0;
//     var nick= req.body.nick;
//     handle= nick.toString();
//     nick= nick.split(/\s/).join('');
//     const url= 'https://codeforces.com/api/user.status?handle='+nick;       
//     rp(url, (err, res, body) => {
//         done= done+1;
//         if(res.statusCode===400){
//             done=1;
//             console.log("Invalid UserId!");
//         }
//         else if(res.statusCode===200){
//             done= done+1;
//             var jsonObject = JSON.parse(body);
//             var result= jsonObject.result;
//             let probMap = new Map();
//             fs.mkdir(nick, function(err){
//                 if(err){
//                     console.log('failed to create directory');
//                     return console.error(err);
//                 }else{
//                     console.log('Directory created successfully');
//                 }
//             });
//             result.forEach((solution) => {
//                 if(solution.verdict==="OK"){
//                     var rating= solution.problem.rating;
//                     if(maxRatingQuestion<rating){
//                         maxRatingQuestion= rating;
//                     }
//                     var id= solution.id;
//                     var contestId= solution.contestId;
//                     var problemName= solution.problem.name.split(/\s/).join('').replace(/[^a-zA-Z ]/g, "");
//                     if(!probMap.has(problemName)){                    
//                         probMap.set(problemName, 1);
//                         var solutionUrl= "https://codeforces.com/contest/" + contestId + "/submission/"+id;
//                         return rp(solutionUrl, (err, res, html) => {
//                             if(!err && res.statusCode===200){
//                                 const $= cheerio.load(html);
//                                 const solutionBody= $('.linenums');
//                                 const code= solutionBody.text();
//                                 var fileName= '/'+problemName+'.cpp';
//                                 const dirPath = path.join(__dirname, '/', nick);
//                                 const writeStream= fs.createWriteStream( dirPath+fileName);
//                                 // console.log(code);
//                                 writeStream.write(code);
//                             }
//                         })
//                         .then()
//                         .catch( (err) => console.log('Skipped!'));
//                     }
//                 }
//             });
//         }
//         var dirPath = path.join(__dirname, '/', nick);
//         class ZipAFolder {
//             static async main() {
//                 await zip(dirPath, dirPath+'.zip');
//             }
//         }  
//     })
//     .then((result) => {
//         ZipAFolder.main();
//         const file = '${__dirname}/'+nick+'.zip';
//         res.download(file);
//         return res.redirect('/');
//     })
//     .catch(err =>{
//         res.redirect('/');
//     });       
// });

app.get("/", (req, res, next) => {
    if(req.statusCode===350){
        res.render('home', {done: -1});
    }
    else{
        res.render('home', {done: 0});
    }
});

app.listen(3000, (result) => {
    console.log('Connected!');
});