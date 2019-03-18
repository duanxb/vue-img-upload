# vue-img-upload 

移动端图片带预览上传组件


## 功能

	+ 1、以兼容安卓、苹果端浏览器与微信端浏览器；
	+ 2、图片上传预览展示
	+ 3、图片上传进度展示
	+ 4、不足：目前只支持一次上传一个文件，可在Html中实现多个文件上传的功能
	+ 5、不足：暂不支持图片压缩，后期可添加该功能

 ## 演示


![vue-img-upload](https://raw.githubusercontent.com/duanxb/vue-img-upload/master/img-upload.gif)

#### Code DEMO
```html
<vue-img-uploader :readonly="readonly" theme="light" accept="image/*" icon="camera" bgimage="/static/imgs/seriouswork/idcard-z.png" :img-src="relationFiled.idcard_positive_url" :ajax-url="uploadApi" @uploadsuccess="onUploadSuccess($event, 'idcard_positive')"></vue-img-uploader>
```
## Props 参数
| 参数        	| 说明           |
| ------------- |-------------|
| accept		|[String], 默认情况下可能会导致选择框弹出慢的问题，请针对具体化图片类型即可解决，默认：'image/*,video/*;'		|
| id          | [String]，唯一性，默认自动生成一个随机数 |
| onChange     | [Function]：文件选择回调 | 
| readonly       | [Boolean]   是否设置为只读模式，只读模式，不可上传。| 
| readonlyTipText  | [String] 只读模式下，显示的文案,默认：'不可更改' |
| bottomText	|[String] 选择图片后，底部显示的文案，默认：'点击图片以修改'		|
| icon 		|[String]	显示的图标 |
| maxSize 	|[Number]	上传图片的大小，默认最大为：5M |
| theme	|[String]	上传控件的classname |
| bgimage	|[String]	上传控件的背景图 |
| ajaxUrl	|[String]	ajax上传的URL |
| iframeUploadUrl	|[String]	IE9中iframe 上传url |




## 事件

| 参数            | 说明          |
| -------------   |-------------|
| input   | [Function] 双向绑定, 传递file文件信息 |
| onChange | [Function] 文件选择回调；参数为 file文件信息 |
| uploadsuccess | 上传成功的回调，参数为ajax返回的data |
| uploaderror  | 上传失败的回调，参数为ajax返回的data |

