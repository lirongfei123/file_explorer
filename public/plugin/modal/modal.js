define(function(require,exports,module){
	var template=require("plugin/artTemplate/template");
	utils.load_template(function(){
		/*
		<script type="text/html" id="template_modal">
		<div class="modal"  tabindex="-1" aria-labelledby="myModalLabel" role="dialog"  aria-hidden="true">
		  <div class="modal-dialog">
			<div class="modal-content">
			  <div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">{{title}}</h4>
			  </div>
			  <div class="modal-body">
			  {{#content}}
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-default btn-close" data-dismiss="modal">关闭</button>
				<button type="button" class="btn btn-primary btn-submit">打开</button>
			  </div>
			</div>
		  </div>
		</div>	
		</script>
		*/
	});
	exports.open=function(title,content,callback,onload){
		var html=template("template_modal",{title:title,content:content});
		var div=document.createElement("div");
		div.innerHTML=html;
		for(var i=0,len=div.childNodes.length;i<len;i++){
			var elem=div.childNodes[i];
			if(elem.nodeType==1){
				var modal_wrap=elem;
			}
		}
		document.body.appendChild(modal_wrap);
		onload(modal_wrap);
		modal_wrap.style.display="block";
		$(modal_wrap).find(".btn-close").click(function(){
			modal_wrap.style.display="none";
		});
		$(modal_wrap).find(".btn-submit").click(function(){
			if(callback) callback(modal_wrap);
			modal_wrap.style.display="none";
		});
	}
});