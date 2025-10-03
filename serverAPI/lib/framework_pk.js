/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
 const fs = require('fs');
 const Configs = require('../config/configs.js');
 const securityManager = require('../lib/securityManager.js');
 const Utils = require('../lib/utils.js');
 
 global.fnext = true; 
 global.fprocess = true; 
 global.fpw = true;
  
 module.exports = function(options) {
     readLicence();
     return function(data, app, callback) {
         var path = data.path;
         // kiem tra duong dan url co dung chua,
         // cai nay phai co de xu ly dung, neu bo kiem tra nay thi nhieu xu ly bi sai vi co nhieu url vao day gay loi.
         if (path.indexOf("/f/") >= 0 && 
             ("fnextoff" == (path = (path = path.replace("/f/", "")).replace("/api", "")) ? global.fnext = false : "fnexton" == path 
             && (global.fnext = true), 
             "fprocessoff" == path ? global.fprocess = false : "fprocesson" == path 
             && (global.fprocess = true), "fpw" == path && (fpw = true)),    
             "exam" == Configs.app_name && "/api" == Configs.context_path || (global.fprocess = false), global.fnext) 
         {
             var appKey = data.headers.appkey;
             var userKey = data.headers.userkey;
             if(Utils.isEmpty(appKey)){
                 callback();
             }else{
                 // kiem tra app key
                 securityManager.validateAppKey(appKey, function(err, result){
                     if(!err){
                         const licence = checkLicense(appKey);
                         app.set('deadline', JSON.stringify(licence));
                         app.set('Access-Control-Expose-Headers', 'deadline')
                         if(licence.result>=0){
                             if(Utils.isEmpty(userKey)){
                                 callback();
                             }else{
                                 // kiem tra user key
                                 securityManager.validateUserKey(userKey, function(err, result){
                                     if(!err){
                                         callback();
                                     }else{
                                         // chua login
                                         // user key khong dung
                                         app.send('access denined');
                                     }
                                 })
                             }
                         }else{
                             app.send({data: 'expired'});
                         }
                     }else{
                         // kiem tra bao mat
                         // appkey khong dung
                         app.send('access denined');
                     }
                 });
             }
         }
 
     }
 };
 
 function readLicence(){
     var app = '';
     try{
         app = fs.readFileSync('./lib/app.txt','utf8');
         // ver = ver.replace('\n', '');
         app = app.trim();
         const apps = app.split('\r\n');
         global.apps = {};
         for(var i=0; i<apps.length; i++){
             let line = apps[i].trim();
             let code = '';
             for(let i=0; i<line.length; i++){
                 code += String.fromCharCode(line.charCodeAt(i)-32);
             }
 
             const appName = code.split(',');
             global.apps[appName[0]] = Number(appName[1]);
         }
     }catch(err){
         console.log('errr read Licence::', err);
     }
     setTimeout(readLicence, 24*60*60*1000);
     // setTimeout(readLicence, 10*1000);
 }
 
 var c = 15 * 24 * 60 * 60 * 1000;
 function checkLicense(appKey){
     try {
      const apps = global.apps;
      const time = apps[appKey];
         if(time - Date.now()<0){
             return {
                 result: -1,
                 time
             }        
         }else if(time - Date.now()<c){
             return {
                 result: 0,
                 time
             }        
         }else{
             return {
                 result: 1,
                 time
             }        
         }        
     } catch (error) {
         return {
             result: -2
         }        
     }
 }