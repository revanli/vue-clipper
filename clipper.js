/**
 *  @name vue移动端上传图片压缩裁剪插件
 *  @author liyufan@thejoyrun.com
 *  @date 2017-09-27
 *  @depency
 *    cropperjs https://github.com/fengyuanchen/cropperjs 裁剪图片
 *    localResizeImg https://github.com/think2011/localResizeIMG 本地客户端压缩图片，兼容IOS, Android
 */
import lrz from 'lrz'
import Cropper from 'cropperjs'

export default {
  install (Vue) {
    // 初始化方法
    Vue.prototype.initilize = function (opt) {
      let self = this;
      this.originUrl = null;
      this.options = opt;
      // 创建DOM
      this.createElement();
      this.resultObj = opt.resultObj;
      // init cropper
      this.cropper = new Cropper(this.preview, {
        aspectRatio: opt.aspectRatio || 1,
        autoCropArea: opt.autoCropArea || 0.8,
        viewMode: 1,
        guides: opt.aspectRatio == 'Free' ? false : true,
        cropBoxResizable: opt.aspectRatio == 'Free' ? false : true,
        cropBoxMovable: opt.aspectRatio == 'Free' ? false : true,
        dragCrop: opt.aspectRatio == 'Free' ? false : true,
        background: false,
        checkOrientation: true,
        checkCrossOrigin: true,
        zoomable: false,
        zoomOnWheel: false,
        center: false,
        toggleDragModeOnDbclick: false,
        ready: function () {
          if (opt.aspectRatio == 'Free') {
            let cropBox = self.cropper.cropBox;
            cropBox.querySelector('span.cropper-view-box').style.outline = 'none';
            self.cropper.disable();
          }
        }
      });
    }

    // 创建DOM用于图片裁剪
    Vue.prototype.createElement = function () {
      // 初始化图片为空对象
      this.preview = null;

      let str = '<div>'
              + ' <img id="clip-image" src="originUrl">'
              + '</div>'
              + '<button type="button" id="cancel-button">取消</button>'
              + '<button type="button" id="clip-button">确定</button>'
              + '<div class="crop-loading">'
              + ' <div class="crop-content">'
              + '   <img src="data:image/gif;base64,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">'
              + '   <div class="crop-text">图片处理中</div>'
              + ' </div>'
              + '</div>'
              + '<div class="crop-success">'
              + ' <div class="crop-success-text">处理成功</div>'
              + '</div>';

      let body = document.getElementsByTagName('body')[0];
      this.reagion = document.createElement('div');
      this.reagion.id = 'clip-container';
      this.reagion.className = 'container';
      this.reagion.innerHTML = str;
      // 添加创建好的DOM元素
      body.appendChild(this.reagion);
      this.preview = document.getElementById('clip-image');

      // 绑定方法
      this.initFunction();
    }

    // 初始化一些函数绑定
    Vue.prototype.initFunction = function () {
      let self = this;
      this.clickBtn = document.getElementById('clip-button');
      this.cancelBtn = document.getElementById('cancel-button');
      // 确定裁剪
      this.addEvent(this.clickBtn, 'click', function () {
        self.crop();
      })
      // 取消裁剪
      this.addEvent(this.cancelBtn, 'click', function () {
        self.destoried();
      })
      // 清空上传file Input值
      this.addEvent(this.fileObj, 'click', function () {
        this.value = '';
      })
    }

    // 外部接口，用于input['file']change时调用
    Vue.prototype.clip = function (e, opt) {
      let self = this;
      this.fileObj = e.srcElement;
      let files = e.target.files || e.dataTransfer.files;

      if (!files.length) return false;
      // 调用初始化方法
      this.initilize(opt);
      // 获取图片文件资源
      this.picValue = files[0];
      // 转成url格式
      // this.originUrl = this.getObjectURL(this.picValue);
      // localResizeImg 压缩处理图片
      document.querySelector('.crop-loading').style.display = 'block';
      lrz(this.picValue).then(rst => {
        document.querySelector('.crop-loading').style.display = 'none';
        this.originUrl = rst.base64;

        // 替换图片得到新的url
        if (this.cropper) {
          this.cropper.replace(this.originUrl)
        }
      }).catch(err => console.log(err))
    }

    // 图片转成url方法
    Vue.prototype.getObjectURL = function (file) {
      let url = null;
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }

    // 裁剪方法
    Vue.prototype.crop = function () {
      let self = this;
      let image = new Image();
      let croppedCanvas;
      let roundedCanvas;

      // crop
      setTimeout(function () {
        croppedCanvas = self.cropper.getCroppedCanvas();
        // Round
        roundedCanvas = self.getRoundedCanvas(croppedCanvas);

        let imgData = roundedCanvas.toDataURL();
        image.src = imgData;
        // 对比图像大小
        console.log('--imgData--', imgData.length, 100 * 1024);

        // 页面显示裁剪后的图像
        self.resultObj.src = imgData;
        // 图片裁剪完成
        // self.postImg(imgData);
        setTimeout(function () {
          self.destoried()
        }, 500)

        typeof self.options.onFinishCrop === 'function' && self.options.onFinishCrop(imgData)

      }, 20)
    }

    // 获取裁剪图片资源
    Vue.prototype.getRoundedCanvas = function (sourceCanvas) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let width = sourceCanvas.width;
      let height = sourceCanvas.height;

      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(sourceCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fill();

      return canvas;
    }

    // 销毁原来的对象
    Vue.prototype.destoried = function () {
      let self = this;
      // 移除事件
      this.removeEvent(this.clickBtn, 'click', null);
      this.removeEvent(this.cancelBtn, 'click', null);
      this.removeEvent(this.fileObj, 'click', null);
      // 移除裁剪框
      this.reagion.parentNode.removeChild(this.reagion);
      // 销毁裁剪对象
      this.cropper.destroy();
      this.cropper = null;
    }

    // 图片上传
    Vue.prototype.postImg = function (imageData) {
      let self = this;

      document.querySelector('.crop-loading').style.display = 'block';
      // 模拟上传后成功的处理
      window.setTimeout(function () {
        document.querySelector('.crop-loading').style.display = 'none';
        document.querySelector('.crop-success').style.display = 'block';
        setTimeout(function () {
          self.destoried()
        }, 500)
      }, 1500)
      // error处理
      // self.resultObj.src = '';
    }

    //添加事件
    Vue.prototype.addEvent = function (obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
      } else {
        obj.attachEvent('on' + type, fn);
      }
    }

    //移除事件
    Vue.prototype.removeEvent = function (obj, type, fn) {
      if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);
      } else {
        obj.detachEvent( 'on' + type , fn );
      }
    }
  }
}
