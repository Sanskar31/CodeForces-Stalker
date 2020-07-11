const rp = require('request-promise');
const request= require('request');
const cheerio = require('cheerio');
const fs= require('fs');
const path= require('path');
const AdmZip = require('adm-zip');

var appDir = path.dirname(require.main.filename);

exports.getDetails= (req, res, next) => {
    var total=0, ac=0, wrong=0, tle=0, runtime=0, memorylimit=0, other=0, compilation=0, hacked=0, done=0, maxRatingQuestion=0,fetched=0;
    //Getting Params From Request
    var nick= req.body.nick;
    handle= nick.toString();
    nick= nick.split(/\s/).join('');

    //Making a URL
    const url= 'https://codeforces.com/api/user.status?handle='+nick;       
    
    //Making a request to the api
    rp(url, (err, res, body) => {
        //If UserId is Invalid
        if(res.statusCode===400){
            done=1;
            // console.log("Invalid UserId!");
        }
        //Otherwise get user details
        else if(res.statusCode===200){
            done= 2;
            var jsonObject = JSON.parse(body);
            var result= jsonObject.result;
            //Map to get rid of multiple accepted submissions of a given problem
            let probMap = new Map();
            //Result is an array of all the submissions
            const folderPath= path.join(appDir, 'data', nick);
            console.log(folderPath);
            if (fs.existsSync(folderPath)){
                // console.log(folderPath);
                fs.rmdir(folderPath, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${folderPath} is deleted!`);
                });
            }
            while(fs.existsSync(folderPath));
            fs.mkdir(folderPath, err =>{
                if(err){
                    console.log(err);
                }
            });

            result.forEach((solution) => {
                total= total+1;
                //If conditions to keep count of all the verdicts
                if(solution.verdict==="OK"){
                    var rating= solution.problem.rating;
                    if(maxRatingQuestion<rating){
                        maxRatingQuestion= rating;
                    }
                    var id= solution.id;
                    var contestId= solution.contestId;
                    //Removing any special characters from the problem name & also removing spaces
                    var problemName= solution.problem.name.split(/\s/).join('').replace(/[^a-zA-Z ]/g, "");
                    if(!probMap.has(problemName)){                    
                        ac= ac+1;
                        probMap.set(problemName, 1);
                        var solutionUrl= "https://codeforces.com/contest/" + contestId + "/submission/"+id;

                        request(solutionUrl, (err, res, html) => {
                            if(!err && res.statusCode===200){
                                // console.log("HELLO");
                                fetched= fetched+1;
                                const $= cheerio.load(html);
                                const solutionBody= $('.linenums');
                                const code= solutionBody.text();
                                var fileName= problemName+'.cpp';
                                const dirPath = path.join(appDir, 'data', nick, fileName);
                                const writeStream= fs.createWriteStream(dirPath);
                                // console.log(code);
                                writeStream.write(code);
                            }
                        });
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
            const dataPath= path.join(appDir, 'data', nick); 
            var uploadDir = fs.readdirSync(dataPath); 
        }
    })
    .then(() => {
        var user= nick;
        URL= "https://codeforces.com/profile/"+nick;
        var accuracy= 0;
        if(total!==0){
            accuracy= (ac/total)*100;
        }
        accuracy= accuracy.toFixed(2);
        res.render('home', { 
            nick: user,
            URL: URL,
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
    .catch((err) => {
        // console.log(err);
        res.render('home', {
            done: 1
        });
    });
    
};

exports.downloadSolutions= (req,res,next) => {
    const nick= req.body.nick;
    const dataPath= path.join(appDir, 'data', nick); 
    var uploadDir = fs.readdirSync(dataPath); 
    const zip = new AdmZip();
 
    for(var i = 0; i < uploadDir.length;i++){
        var filePath= path.join(appDir, 'data', nick, uploadDir[i]);
        zip.addLocalFile(filePath);
    }
 
    // Define zip file name
    const downloadName = nick+'.zip';
 
    const data = zip.toBuffer();
 
    // save file zip in root directory
    var zipPath= path.join(appDir, 'download', downloadName);
    zip.writeZip(zipPath);
    
    // code to download zip file
 
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${downloadName}`);
    res.set('Content-Length',data.length);
    res.send(data);
};
