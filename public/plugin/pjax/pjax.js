define(function(require,exports,module){
	function create_pjax(){
		var pjax_history={};
		var config={
			element:null
		};
		window.onpopstate=function(event){
			if(/^pjax-.*$/.test(event.state)){
				var element=event.state.substr(event.state.indexOf("-")+1);
				request(element,location.href,true);
			}
		}
		function request(element,url,isback){
			$.ajax({
				type:"GET",
				headers:{
					HTTP_X_PJAX:true
				},
				url:url,
				success:function(data){
					if(typeof isback=="undefined"){
						history.pushState("pjax-"+element,"pjax_ajax",url);
					}
					var elem=typeof element=="string"?document.getElementById(element):element;
					elem.innerHTML=data;
				}
			});
		}
		return {
			config:function(obj){
				for(var i in obj){
					config[i]=obj[i];
				}
			},
			request:function(obj){
				if(typeof obj=="string"&&config.element!=null){
					request(config.element,obj);
				}else if(typeof obj=="object"&&obj.element!=null){
					request(obj.element,obj.url);
				}
			}
		}
	}
	module.exports=create_pjax();
});