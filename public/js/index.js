define(function(require,exports,module){
	require("plugin/zTree/js/jquery.ztree.all-3.5.min");
	var path=require("plugin/path/path");
	var modal=require("plugin/modal/modal");
	require("plugin/ace_editor/ace");
	var pjax=require("plugin/pjax/pjax");
	var template=require("plugin/artTemplate/template");
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
			editor_content.onkeydown=function(event){
				if(event.ctrlKey){
					if(event.keyCode==83){
						event.preventDefault();
						event.stopPropagation();
						$.post("/file/save",{value:editor.getValue(),path:filepath},function(data){
							console.log(data);
						});
					}
				}
			}
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
		},
		view: {
			selectedMulti: false
		},
		async: {
			enable: true,
			url:"/file/getdirtree",
			autoParam:["id=dir"],
			type:"get"
		}
	};
	//打开新的文件夹
	$("#new_file_explorer button").click(function(){
		utils.load_template(function(){
			/*
			<script type="text/html" id="template_choose_folder">
			<input type="text" class="form-control directory"  placeholder="输入路径">
			<ul class="list-group" style="margin-top:20px;">
				{{each directory_history as directory}}
					<li class="list-group-item"><a class="history" href="javascript:void(0)">{{directory}}</a></li>
				{{/each}}
			</ul>
			</script>
			*/
		});
		//localStorage.removeItem("directory_history")
		modal.open("打开文件夹",template("template_choose_folder",{directory_history:JSON.parse(localStorage.getItem("directory_history"))}),function(modal_wrap){
			var dir=$(modal_wrap).find("input.directory")[0].value;
			$.get("/file/getdirtree?dir="+dir,function(data){
				$.fn.zTree.init($("#tree_content"),setting,JSON.parse(data));
			});
			var directory_history=[];
			if(localStorage.getItem("directory_history")!=null){
				directory_history=JSON.parse(localStorage.getItem("directory_history"));
			}
			if(directory_history.indexOf(dir)==-1){
				directory_history.push(dir);
			}
			if(directory_history.length>8){
				directory_history.shift();
			}
			localStorage.setItem("directory_history",JSON.stringify(directory_history));
		},function(modal_wrap){
			$(modal_wrap).find(".history").click(function(){
				$.get("/file/getdirtree?dir="+$(this).text(),function(data){
					$.fn.zTree.init($("#tree_content"),setting,JSON.parse(data));
				});
				modal_wrap.style.display="none";
			});
		});
	});
});