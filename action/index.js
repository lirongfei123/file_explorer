var jade=require("jade");
exports.index=function(req,res){
	res.send(jade.renderFile("./templates/index.jade"));
}