define(function(require,exports,module){
	exports.get_file_type=function(path){
		return path.substr(path.lastIndexOf(".")+1);
	}
});
