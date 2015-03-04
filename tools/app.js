var fs=require("fs");
exports.response_file=function(path,req,res){
	fs.exists("."+path,function(exists){
		if(exists){
			fs.readFile("."+path,function(err,data){
				if(err) throw err;
				res.send(data.toString());
			});
		}else{
			res.send(404, 'Sorry, we cannot find that!');
		}
	});
}