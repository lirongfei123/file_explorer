define(function(require,exports,module){
	require("plugin/zTree/js/jquery.ztree.all-3.5.min");
	var path=require("plugin/path/path");
	require("plugin/ace_editor/ace");
	var pjax=require("plugin/pjax/pjax");
	pjax.config({element:"script_content"});
	window.load_file=function(filepath,content){
		var file_type=path.get_file_type(filepath);
		file_type=file_type=="js"?"javascript":file_type;
		var editor_content=document.getElementById(filepath);
		if(editor_content==null){
			var editor_content=document.createElement("div");
			editor_content.id=filepath;
			editor_content.className="editor_content";
			var editor = ace.edit(editor_content);
			require("plugin/ace_editor/mode-"+file_type);
			editor.getSession().setMode("ace/mode/"+file_type);
			document.getElementById("editor_content_wrap").appendChild(editor_content);
		}
		$(".editor_content").each(function(key,elem){
			if(elem!=editor_content){
				elem.style.display="none";
			}
		});
		editor_content.style.display="block";
		var editor = ace.edit(editor_content);
		if(editor.getValue()!=content){
			editor.setValue(content,-1);
		}
	}
	if(typeof init_load_file_path!="undefined"&&typeof init_load_file_content!="undefined"){
		load_file(init_load_file_path,init_load_file_content);
	}
	var setting = {
		callback:{
			onClick:function(event,treeid,treenode){
				var file_type=path.get_file_type(treenode.id);
				if(/^(js|css|scss|html)$/.test(file_type)){
					pjax.request("/file/edit?file="+treenode.id);
				}else{
					utils.yibu_tishi("不支持打开此文件类型，只能打开js，html，css");
				}
				
			}
		},
		data: {
				simpleData: {
					enable: true
				}
		}
	};
	$.get("/file/getdirtree?dir=public",function(data){
		$.fn.zTree.init($("#tree_content"),setting,JSON.parse(data));
	});
	
});