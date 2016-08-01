var wordName;	
var next_ready=true;
HJ ={};

HJ.fun = {
	// ajax回调函数
	jsonCallBack : function(json) {
		var meaning = json.content;
		showMeaning(meaning);
		
		if(!meaning.includes('hjd_noresult')){
			add(wordName, json.content);
		}
		
		next_ready=true;
		// localStorage.result = json.content;
		// console.debug(localStorage["result"]);
		/*
		$.post("http://localhost/redbag/test/savedata.php", { meaning: json.content },
				   function(data){
					 
				   });
				   */
	},
	changeLanguage : function() {

	},
};

var wordMap={
		MAX_NUM:50,
		_keys:new Array(),
		_values:new Array()
   }

	var is_exist=function(key){
		for(var i=0;i<wordMap._keys.length;i++){
			if(wordMap._keys[i]==key){
				return true;//包含此元素
			}
		}
		return false;//不包含此元素
	};
	/*
	var add= function(key, value) {
		//若已存在，则不进行任何操作
		if(is_exist(key)){
			return;
		}
		//若不存在,并且已保存的元素达到上限，则删除第一个元素
		if(wordMap._keys.length>=wordMap.MAX_NUM){
			var firstKeys=wordMap._keys.shift();
			delete wordMap._values[firstKeys];
		}
		//保存元素
		wordMap._keys.push(key);
		wordMap._values[key]=value;
	};
	var getValue=function(key){
		return wordMap._values[key];
	}
*/
	var add= function(key, value) {
		localStorage[key]=value;
	}
	var getValue=function(key){
		return localStorage[key];
	}


var funGetSelectTxt = function() {
	var txt = "";
	if(document.selection) {
		txt = document.selection.createRange().text;	// IE
	} else {
		txt = document.getSelection();
	}
	return txt.toString();
};
var boxleft;
var boxtop;
var leftPt;
var topPt;

	function showMeaning(data){
		 $("#meaning").html(data);
	     var meaningBox=document.getElementById("meaning");
	     meaningBox.style.display = "inline";
			meaningBox.style.left =leftPt;
			meaningBox.style.top = topPt;
			$("#meaning").show();
	}
	
	function lookup(param){
		if(param.length>15){
			return;
		}
		var nameVal = getValue(param);
		if (nameVal) {
			showMeaning(nameVal);
		} else {
			if(next_ready==false){
				return;//前一个词处理完之前，不能改变全局变量wordName的值，否则单词与解释对应不上
			}
			wordName=param;		
			next_ready=false;
			var query_url = "http://dict.hjenglish.com/services/simpleExplain/jp_simpleExplain.ashx?type=jc&w="
					+ param;
			// showMeaning(data);
			// add(param, data);
			$.ajax({
				type : "get",
				async : true,
				url : query_url,
				//dataType : "jsonp",
				//jsonp : "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
				success : function(json) {
					eval(json);				
				},
				error : function(data) {
				}
			});

		}
	 
	}
	var selectedTranslate = function(eleContainer) {
		eleContainer = eleContainer || document;
		var funGetSelectTxt = function() {
			var txt = "";
			if(document.selection) {
				txt = document.selection.createRange().text;	// IE
			} else {
				txt = document.getSelection();
			}
			return txt.toString();
		};
		eleContainer.onmouseup = function(e) {
			e = e || window.event;
			var txt = funGetSelectTxt(), sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			var left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40, top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;
			if (txt) {
			//有文字选中时
				boxleft=left;
				boxtop=top;
				leftPt= left + "px";
				topPt=top + "px";
				lookup(txt);//ajax是异步的，发须要在数据返回后，才能执行的要放在回调函数里	
				
			} else {
			
			}
		};
	}
	$(function(){
		$("body").append('<div id="meaning">单词解释</div>');
		$("#meaning").hide();
		selectedTranslate();
		
		//注册单击事件
		$("body").mousedown(function(e){
			e = e || window.event;
			//如果点击单词解释以外的页面，则隐藏解释框
			var mx=e.clientX;
			var my=e.clientY;
			if(mx>=boxleft&&mx<=boxleft+280&&my>=boxtop){
				
			}else{
				$("#meaning").hide();
			}		
		/*	用到插件中这种方法，不起作用
		if(e.srcElement.id != "meaning"){
			$("#meaning").hide();
			}
			*/
			});
	});