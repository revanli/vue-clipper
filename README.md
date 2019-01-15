### vue移动端上传图片压缩裁剪插件

> 移动端上传图片压缩和裁剪的vue插件

#### 为什么需要
- 在移动设备端，现在图片的大小越来越大，动辄超过几M，大则十几M，因为很有必要
  压缩图片后再传给后端，这样可以有效的节省带宽和提高用户体验
- 兼容问题。移动端有些低版本的IOS(IOS 6) safari，超过2M图片画到canvas无
  法正常渲染，低版本的Android(< 4.5)以下的bug
- IOS下图片方向无规律，压缩比例失调问题

#### 解决方案
使用lcoalResizeIMG
- lrz引入exif读取图片的元信息，然后进行旋转修复
- lrz引入megapix-image解决ios下图片过大无法渲染到canvas的问题

#### 依赖
- [lrz](https://github.com/think2011/localResizeIMG)
- [cropper](https://github.com/fengyuanchen/cropperjs)

#### lrz源码逻辑
- 基本原理是通过canvas渲染图片，再通过 toDataURL 方法压缩保存为base64字符串（能够编译为jpg格式的图片）
- 基本原理是通过canvas渲染图片，再通过 toDataURL 方法压缩保存为base64字符串（能够编译为jpg格式的图片）
1. 收到传入的文件后，创建一个 canvas 对象 和 blob 对象（其实也就是对应的文件引用，所以能被 img src直接引用）
2. 创建 img 对象，标记允许跨域处理，src 设置为 blob，接下来就是开始压缩了。
3. 开始压缩，获取图片旋转的方向，计算用户设置的尺寸，设置canvas
- 发现是iOS低版本，异步载入iOS兼容文件，调整为正确方向，保存压缩，并返回 base64
- 其他情况，调整为正确方向 其他情况1：发现android低版本，异步载入android兼容文件，保存压缩，并返回 base64 其他情况2：保存压缩，并返回 base64
4. 尽可能释放内存

#### 使用
1、在main.js中引入clipper.js

```javascript
// main.js
import clipper from '/path/to/your/clipper.js'
Vue.use(clipper)
```
2、在需要用到插件的页面引入clipper.css

```less
// XXX.vue
... // other code

<style lang="less">
@import url('/path/to/your/clipper.css');
</style>
```

3、准备上传的file input和一个预览的img标签，上传后的图片会预览到target img上

```javascript
<input type="file" accept="image/*" id="capture" @change="upload($event)">
<img id="target" ref="target">
```

4、upload方法

```javascript
... // other code
method () {
  upload (event) {
    let targetObj = document.getElementById('target')
    const wrapWidth = $('#target').width()
    const wrapHeight = $('#target').height()
    const wrapRatio = (wrapWidth / wrapHeight) || 1

    this.clip(event, {
      resultObj: targetObj,
      zoomable: true,
      zoomOnWheel: true,
      aspectRatio: wrapRatio,
      onFinishCrop: (imgData) => {
        // do finishcrop thing
        // imgData 是 压缩后的base64图片
      }
    })
  },
}
... // other code
```

