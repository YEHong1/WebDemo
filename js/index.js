window.onload = function(){
	
	/*arrow箭头的交互部分*/
	//获取arrow的dom元素
	var arrow = document.querySelector('.arrow');
	//获取所有li
	var liNodes = document.querySelectorAll('#head > .headMain > .nav > .list > li');
	//li下的up
	var upNodes = document.querySelectorAll('#head > .headMain > .nav > .list > li .up')
	var firstLiNode = liNodes[0];
	var firstUpNode = upNodes[0];
	
	/*内容交互部分变量*/
	//头部元素
	var head = document.querySelector('#head');
	//内容部分元素
	var content = document.querySelector('#content');
	//内容下的所有li
	var cListNodes = document.querySelectorAll('#content > .list > li');
	//
	var cList = document.querySelector('#content > .list');
	//获取当前页面的索引
	var now = 0;
	var timer = 0;
	
	/*第一屏的变量*/
	var home1 = document.querySelector('#content .list > .home .home1');
	//轮播图元素
	var home1LiNodes = document.querySelectorAll('#content .list > .home .home1 > li');
	//圆点元素
	var home2LiNodes = document.querySelectorAll('#content .list > .home .home2 > li');
	//小圆点的上一个索引
	var oldIndex = 0;
	//轮播图计算器
	var timer3D = 0;
	//自动轮播的索引
	var autoIndex = 0;
	
	
	/*第四屏的变量*/
	var aboutUls = document.querySelectorAll('#content .list > .about .about3 > .item > ul');
	
	
	
	
	
	
	
	/*头部交互*/
	headBind();
	function headBind(){
		/*箭头默认在home图标的正下方，
		 即箭头的偏移量为：Home相对于定位父元素的偏移量 + Home自身宽度的一半 - 箭头宽度的一半*/
		arrow.style.left = firstLiNode.offsetLeft + firstLiNode.offsetWidth/2 - arrow.offsetWidth/2 + 'px';
		cList.style.top = -now * (document.documentElement.clientHeight - head.offsetHeight) + 'px';
		firstUpNode.style.width = "100%"
		//给每个li添加点击事件
		for(var i=0; i<liNodes.length; i++){
			//转绑，在事件中i总是等于liNodes.length的
			liNodes[i].index = i;
			liNodes[i].onclick = function(){
				move(this.index);
				now = this.index;
			}
		}
	}
	
	/*箭头移动*/
	function move(index){
		//遍历up属性
		for(var i=0; i<upNodes.length; i++){
			//当箭头移动时，先让所有的up属性隐藏
			upNodes[i].style.width = '';
		}
		
		//箭头跟随移动
		upNodes[index].style.width = '100%';
		arrow.style.left = liNodes[index].offsetLeft + liNodes[index].offsetWidth/2 - arrow.offsetWidth/2 + 'px';
		
		//屏幕滑动
		cList.style.top = -index*(document.documentElement.clientHeight - head.offsetHeight) + 'px';
	}
	
	

	
	/*内容部分交互*/
	contentBind();
	function contentBind(){
		//内容的高度
		content.style.height = document.documentElement.clientHeight - head.offsetHeight + 'px';
		for(var i=0; i<cListNodes.length; i++){
			//每一屏的高度
			cListNodes[i].style.height = document.documentElement.clientHeight - head.offsetHeight + 'px';
		}
	}
	
	
	
	
	
	/*滚轮滑屏事件
	 火狐滚动事件有兼容兼容问题
	 
	 谷歌：上正 下负             onmousewheel       ev.wheelDelta
	 火狐：上负  下正		DOMMouseScroll	   ev.detail
	 * */
	if(content.addEventListener){
		//火狐
		content.addEventListener('DOMMouseScroll',function(ev){
			ev=ev||event;
			
			//让fn的逻辑在DOMMouseScroll事件被频繁触发的时候只执行一次
			clearTimeout(timer);
			timer = setTimeout(function(){
				fn(ev);
			},200)	
		});
	}
	
	//其他浏览器
	content.onmousewheel = function(ev){
		ev=ev||event;
		clearTimeout(timer)
		timer = setTimeout(function(){
			fn(ev);
		},200)
	}
	
	
	function fn(ev){
		ev = ev || event;
		var dir = '';
		if(ev.wheelDelta){
			dir = ev.wheelDelta > 0 ? "up" : "down";
		}else if(ev.detail){
			dir = ev.detail < 0 ? "up" : "down";
		}
		
		
		switch(dir){
			case "up":
				if(now > 0){
					now--;
					move(now);
					outAn();
				}
				break;
				
			case "down":
				if(now < cListNodes.length-1){
					now++;
					move(now);
					inAn();
				}
				break;
		}
	}
	
	
	
	
	/*第一屏的轮播图
	 * 
	 *点击圆点选中效果切换 || 图片切换：
	 *通过for循环遍历所有小圆点，并添加点击事件，
	 *删除所有的小圆点上的active类，给当前点击的小圆点添加active类
	 *判断当前索引跟旧索引的关系，从而判断切换方向，然后通过添加相应的类来实现效果
	 * 注意点是：切换图片后，要把索引赋值给就索引，
	 * 
	 *轮播图：
	 * 设置一个定时器和一个轮播索引，轮播索引自增，轮播索引和旧索引比较，判断其方向
	 * 然后给元素添加相应的类来实现播放，
	 * 当轮播索引和轮播图数量相等时，设置轮播索引的值为0，来实现无缝播放
	 */
	home3D();
	function home3D(){
		//小圆点的点击事件
		for(var i=0; i<home2LiNodes.length; i++){
			home2LiNodes[i].index = i;
			home2LiNodes[i].onclick = function(){
				clearTimeout(timer3D);
				//清楚所有圆点的选中状态
				for(var j=0; j<home2LiNodes.length; j++){
					//该属性用于在元素中添加，移除及切换 CSS类
					home2LiNodes[j].classList.remove('active')
				}
				home2LiNodes[this.index].classList.add('active')
				
				//从左往右
				if(this.index > oldIndex){
					home1LiNodes[oldIndex].classList.remove('leftShow');
					home1LiNodes[oldIndex].classList.remove('rightShow');
					home1LiNodes[oldIndex].classList.remove('rightHidden');
					home1LiNodes[oldIndex].classList.add('leftHidden');
					
					home1LiNodes[this.index].classList.remove('leftShow');
					home1LiNodes[this.index].classList.remove('leftHidden');
					home1LiNodes[this.index].classList.remove('rightHidden');
					home1LiNodes[this.index].classList.add('rightShow');
				}
				
				//从右往左
				if(this.index < oldIndex){
					home1LiNodes[oldIndex].classList.remove('leftHidden');
					home1LiNodes[oldIndex].classList.remove('rightShow');
					home1LiNodes[oldIndex].classList.remove('leftShow');
					home1LiNodes[oldIndex].classList.add('rightHidden');
					
					home1LiNodes[this.index].classList.remove('rightHidden');
					home1LiNodes[this.index].classList.remove('leftHidden');
					home1LiNodes[this.index].classList.remove('rightShow');
					home1LiNodes[this.index].classList.add('leftShow');
				}
				
				oldIndex = this.index;
				autoIndex = this.index;
			}
		}
		
		//从左向右播放
		Carousel();
		function Carousel(){
			clearInterval(timer3D);
			timer3D = setInterval(function(){
				
				autoIndex ++;
				//无缝播放
				if(autoIndex == home1LiNodes.length){
					autoIndex = 0;
				}
				
				//圆点同步实现
				for(var i=0; i<home2LiNodes.length; i++){
					home2LiNodes[i].classList.remove('active')
				}
				home2LiNodes[autoIndex].classList.add('active');
				
				home1LiNodes[oldIndex].classList.remove('leftShow');
				home1LiNodes[oldIndex].classList.remove('rightShow');
				home1LiNodes[oldIndex].classList.remove('rightHidden');
				home1LiNodes[oldIndex].classList.add('leftHidden');
					
				home1LiNodes[autoIndex].classList.remove('leftShow');
				home1LiNodes[autoIndex].classList.remove('leftHidden');
				home1LiNodes[autoIndex].classList.remove('rightHidden');
				home1LiNodes[autoIndex].classList.add('rightShow');
				
				oldIndex = autoIndex;
				
			},3000);
		}
		
		home1.onmouseenter = function(){
			clearInterval(timer3D);
		}
		
		home1.onmousemove = function(){
			Carousel();
		}
	}
	
	
	
	
	
	
	/*第四屏的js
	 *
	 *图片炸裂效果：
	 * 1.每一个盒子里面有两张图片，绝对定位后，下面一张为我们看到的，
	 * 下面的图片放大1.3倍，hover时恢复到原来的大小，且有一个过度效果
	 * 上面的图片我将它存放在ul中，用data-src保存,在js中用dataset.src获取图片路径
	 * 我们再每个ul下创建4个li和4个img节点，将img添加到li，li添加到ul
	 * 其中每个li的宽度和高度均为ul宽高的一半
	 * 再css中li为相对定位，overflow：hidden，img为绝对定位，再通过偏移img来展示一张完整的图片
	 * 在onmouseenter和onmouseleave事件中，获取li下的img元素，设置相应偏移量
	 *
	 * 
	 * 问题：在获取li下的img时，原本用的时document，获取了8张图片，但我们设置偏移量的时候
	 * 是这样用的：imgNodes[0]\imgNodes[1]\imgNodes[2]\imgNodes[3]
	 * 这时我们获取到的img始终都是前四张，所以但我们鼠标悬停在第二个ul时，改变的时第一个ul的图片炸裂效果，
	 * 解决方法时把document改为this，从而获取到该ul对应的img
	 */
	picBoom();
	
	function picBoom(){
		for(var i=0; i<aboutUls.length; i++){
			change(aboutUls[i]);
		}
		
		
		function change(ul){
			//获取data-src的值,dataset相当于去掉dataset-前缀
			var src = ul.dataset.src
			//ul下每个li的宽高(每个ul里有4个li)
			var w = ul.offsetWidth/2;
			var h = ul.offsetHeight/2;
			//在每个ul下创建4个li节点
			for(var i=0; i<4; i++){
				var liNode = document.createElement('li');
				liNode.style.width = w + 'px';
				liNode.style.height = h + 'px';
				
				//创建img加入到li节点中
				var imgNode = document.createElement('img');
				/*
				第一张图片不用偏移 :                                     left: 0  top:0
				第二张需要向左偏移一个li的宽度 :                          left:-w  top:0
				第三张图片需要向上偏移一个li的高度 :                       left: 0 top:-h
				第四张图片需要向左偏移一个li的宽度和向上偏移一个li的高度 :   left:-w top:-h
				* */
				imgNode.style.left = -(i%2)*w + 'px';
				imgNode.style.top = -Math.floor(i/2)*h + 'px';
				imgNode.src = src;
				
				liNode.appendChild(imgNode);
				ul.appendChild(liNode);
			}
			
			ul.onmouseenter = function(){
				/*
				 * 图片原本的偏移量
				1. left:0    top:0
				2. left:-w   top:0
				3. left:0    top:-h
				4. left:-w   top:-h
				*/
				/*
				 * 最终偏移的量
				1. left:0    top:h
				2. left:-2w   top:0
				3. left:w    top:-h
				4. left:-w   top:-2h
							
				var arrLeft=[0,-2,1,-1];
				var arrTop=[1,0,-1,-2];
				*/
				var imgNodes = this.querySelectorAll('li > img');
				imgNodes[0].style.top = h + 'px';
				imgNodes[1].style.left = -2*w + 'px';
				imgNodes[2].style.left = w + 'px';
				imgNodes[3].style.top = -2*h + 'px';
			}
			
			ul.onmouseleave = function(){
				var imgNodes = this.querySelectorAll("li>img");
				imgNodes[0].style.top = 0+"px";
				imgNodes[1].style.left = -w+"px";
				imgNodes[2].style.left = 0+"px";
				imgNodes[3].style.top = -h+"px";
			}
		}
	}
	
	
	
	
	/*第五屏*/
	var Rect1 = document.querySelector('#content .list > .team .team1');
	var Rect2 = document.querySelector('#content .list > .team .team2');
	
	function inAn(){
		Rect1.style.transform = "translateX(0px)";
		Rect2.style.transform = "translateX(0px)";
	}
	
	function outAn(){
		Rect1.style.transform = "translateX(-200px)";
		Rect2.style.transform = "translateX(200px)";
	}
	
	
}
