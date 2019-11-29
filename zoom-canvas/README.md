### 图片放大缩小+canvas涂鸦

因为之前的项目需要，然后时间又比较紧，需要快速实现功能。所以就结合了一个图片缩放插件（我记录在js插件博客内了），和 [javascript结合html5 canvas实现(可调画笔颜色/粗细/橡皮)的涂鸦板](http://www.jb51.net/article/36186.htm) 这篇博文快速做了一个demo出来。

简单来说就是把缩放插件所缩放的img换成了canvas，同时修改了缩放插件的函数，让初始化缩放的时候导出一个obj对象，对象包含鼠标拖动的事件，用于处理点击鼠标涂鸦和画图的冲突。

而在涂鸦这里则针对canvas的放大处理坐标，将画布内的原始坐标除以canvas的放大倍数，从而保证canvas缩放后涂鸦能正常使用。

而在图片和涂鸦的处理中则采用了分离的方法，在涂鸦的时候把图片作为画布的background，这样用户可以看到图片，但是不能擦掉图片内容，而在导出画布内容的时候再将图片放到canvas中，合并涂鸦导出图片。

当然如果你需要修改的话，依然把原图作为canvas的background，这样就算用户擦掉了canvas中的图片，下面的background也会让整个画布看起来天衣无缝，前提是你要把画布内容和下面的background对准哦。

代码大家可以clone到本地查看，打开index文件可直接查看效果。下面附几个套用该demo的一些tip。

### TIP

下文#canvas为画布id，画布大小为512px*512px。

#### 画布的清除：

```
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
ctx.clearRect(0,0,512,512);
```

#### 缩放重置：

代码意思是将画布缩小500倍，但是实际上画布缩小到初始大小就不能被缩小了，这样就达到了重置缩放的目的。但是这里需要注意，不能在缩放模块隐藏后使用，不然会出问题。

```
$('#canvas').smartZoom('zoom', -500);
```

#### 缩放模块：

缩放模块需要在项目开始的时候进行初始化，而如果这时候缩放模块需要隐藏，则使用 `visibility: hidden` ，否则会初始化失败。而如果缩放模块显示后需要隐藏，则需使用 `display: none` ，否则放大后的图片不能被隐藏掉。因为使用none来隐藏内容，所以这时候初始化缩放就会找不到图片而出问题。

#### 函数封装：

顺带附上我在实际项目中根据实际需要封装的合并函数。

```
			// 合并墨迹图片函数
			// 正常不加i是保存同时清掉画布内容  加i则不清除画布内容
			function merge(i){
				var Output;
				var canvas = document.getElementById("canvas");
				var ctx = canvas.getContext('2d');
				// 判断是否划线，checkCanvas=0没画，=1画过
				if(checkCanvas == 1) {
					var img = new Image();
					var l = $('#canvas').css('background-image').length;
					img.src = $('#canvas').css('background-image').substring(5,l-2);
					var imgs = new Image();
					imgs.src = this.canvas.toDataURL();
					img.onload = function() {
						ctx.drawImage(img,0,0,512,512) // 保证图片加载后才放到画布中
						ctx.drawImage(imgs,0,0,512,512)
						// ==============保存图片===========
						// 带有墨迹的图片以base64形式输出，保存在Output
						Output = canvas.toDataURL();
						// 保存图片到对象===
						picObj[$("#curID").val()] = Output;
						// 重置缩放  发现有个bug  分开在需要的地方使用
						// $('#canvas').smartZoom('zoom', -500);
					};
					// 重置checkCanvas = 0
					checkCanvas = 0;
				};
				if(!i){
					// 不管是否保存,都需要清掉画布内容
					setTimeout(function(){
						ctx.clearRect(0,0,512,512);
					},0);
				}
			}
```

#### 2017/06/26 更新 canvas自适应

之前的项目中，canvas中的图片都是定长定宽，所以直接把canvas的大小写死了。但是最近给出的一批图片数据来自用户采集，各种奇怪的分辨率，所以就需要做到动态调整canvas大小去适应图片，本来想着大的分辨率需不需要压缩大小以完全显示，但实际测试发现不管canvas多大，smartZoom都能将其缩放到外框的大小，这点非常不错。

所以我对这个demo的修改就变得十分简单了：

首先在116行的div #parent 内添加一个img标签，存放用于canvas中显示的图片，在smartZoom初始化之前，通过`$('#img').height()` 和 ​`$('#img').width()` 获取图片宽高赋值给canvas的height和width（这里的height和width不是css的height和width，使用`$('#canvas').attr()` 来赋值）。