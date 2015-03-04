var express=require("express");
var fs=require("fs")
var jade=require("jade");
var route=require("./route")
var app_tools=require("./tools/app");//自定义工具
var app=express();
app.use('/public',express.static(__dirname+"/public"));//设置静态文件目录
/*先过滤具体路由*/
app.all("*",function(req,res,next){
	var path=req.path;
	var isRoute=false;
	for(var i in route){
		var reg=new RegExp("^"+i+"$");
		if(reg.test(path)){
			isRoute=true;
			route[i](req,res);
		}
	}
	if(!isRoute){
		next();
	}
});
/*没有路由，根据规则匹配具体的action，没有action匹配文件，没有文件返回404*/
app.all("*",function(req,res){
	var path=req.path;
	var isRoute=false;
	var result=/^((\/[^\/]+?){2})(\.html|\.htm)*$/.exec(path);
	if(result==null){
		app_tools.response_file(path,req,res);
	}else{
		var action_path=result[1].slice(1);
		var action_arr=action_path.split("/");
		var require_path="";
		for(var i=0,len=action_arr.length;i<len-1;i++){
			require_path+=action_arr[i]+"/";
		}
		require_path=require_path.slice(0,-1);
		if(require_path){
				fs.exists("./action/"+require_path+".js",function(exists){
					if(exists){ 
						var action=require("./action/"+require_path);
						if(typeof action[action_arr[action_arr.length-1]]=="undefined"){
							app_tools.response_file(path,req,res);
							return;
						}
						action[action_arr[action_arr.length-1]](req,res);
					}else{
						
						app_tools.response_file(path,req,res);
					}
				});
		}
	}
});
app.listen(8081);