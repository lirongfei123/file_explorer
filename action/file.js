var fs=require("fs");
var jade=require("jade");
exports.getdirtree=function(req,res){
	var dir=req.query["dir"];
	var dirjson=[];
	function get_tree(dir){
		var data=[];
		var files=fs.readdirSync(dir);
		for(var i=0,len=files.length;i<len;i++){
			var file=dir+"/"+files[i];
			var file_info=fs.statSync(file);
			if(file_info.isDirectory()){
				data.push({id:file,name:files[i],isParent:true});
			}else{
				data.push({id:file,name:files[i]});
			}
		}
		return data;
	}
	if(fs.existsSync(dir)){
		res.send(JSON.stringify(get_tree(dir)));
	}else{
		res.send("no");
	}
}
exports.edit=function(req,res){
	var path=req.query["file"];
	fs.exists(path,function(exists){
		if(exists){
			fs.readFile(path,function(err,data){
				if(err) throw err;
				if(req.get("HTTP_X_PJAX")){//如果是pjax就返回局部内容
					res.send("<script type=\"text/html\" id=\"ajax_file_content\" style=\"display:none;\">"
					+data.toString()+"</script><img src='error' style='position:absolute;left:-100000px;' onerror='load_file(\""
					+path+"\",document.getElementById(\"ajax_file_content\").innerHTML)' />");
				}else{//如果是重新打开就返回完整内容
					var script="<script type=\"text/html\" id=\"ajax_file_content\" style=\"display:none;\">"
					+data.toString()+"</script><script>var init_load_file_path=\""
					+path+"\";var init_load_file_content=document.getElementById(\"ajax_file_content\").innerHTML</script>";
					var html=jade.renderFile("./templates/index.jade",{init_script:script});
					res.send(html);
				}
			});
		}else{
			res.send('no file');
		}
	});
}
exports.save=function(req,res){
	var value=req.body["value"];
	var path=req.body["path"];
	fs.exists(path,function(exists){
		if(exists){
			fs.writeFile(path, value,function(err){
				if(!err){
					res.send("1");
				}else{
					res.send("0");
				}
			});
		}
	});
}