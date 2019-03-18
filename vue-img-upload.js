/*
 * @Author: DuanXiBao
 * @LastEditors: DuanXiBao
 * @Description: 基于Vue的图片上传组件，图片预览，上传进度显示，目前仅支持一次上传单张，已经兼容安卓、苹果系统。
 *              内部代码中可以支持IE9的Iframe上传方法，可自行查找。
 * @Date: 2018-03-15 15:32:00
 * @LastEditTime: 2019-03-15 15:45:04
 */


Vue.component('vueImgUploader', {
    template: '<div class="img-inputer" :class="[themeClass, sizeClass, nhe ? \'nhe\': \'\', ]" ref="box">\
                            <div class="img-inputer-bg" :style="{backgroundImage: bgImgSrc}"></div>\
                          <i class="iconfont img-inputer__icon" v-html="iconUnicode"></i>\
                          <p class="img-inputer__placeholder" v-if="placeholder">{{placeholder}}</p>\
                          <div class="img-inputer__preview-box" v-if="imgSelected && dataUrl">\
                            <img :src="dataUrl" class="img-inputer__preview-img" v-show="dataUrl">\
                          </div>\
                          <label :for="readonly ? \'\' : inputId" class="img-inputer__label"></label>\
                          <div class="img-inputer__mask" v-if="dataUrl">\
                            <p class="img-inputer__file-name">{{fileName}}</p>\
                            <p class="img-inputer__change" v-if="readonly">{{readonlyTipText}}</p>\
                            <p class="img-inputer__change" v-else>{{bottomText}}</p>\
                            </div>\
                          <div class="uploadProgress" v-show="percent > 0 && progressVisible">\
                    <div class="uploadProgressBox">\
                    <svg width="40" height="40" viewbox="0 0 40 40">\
                          <circle cx="20" cy="20" r="18" stroke-width="4" stroke="#D1D3D7" fill="none"></circle>\
                          <circle :id="circleElementRef" cx="20" cy="20" r="18" stroke-width="4" stroke="#00A5E0" fill="none" transform="matrix(0,-1,1,0,0,40)" stroke-dasharray="0 152"></circle>\
                      </svg>\
                      <span class="progressNumber" :id="progressNumberRef"></span>\
                  </div>\
                          </div>\
                          <template v-if="ieBate_9">\
                          <form :target="\'uploadIframe\'+inputId" :action="iframeUploadUrl" method="post" enctype="multipart/form-data" :id="\'uploadForm\'+inputId">\
                          <input ref="inputer" type="file" name="file" :id="inputId" :accept="accept" class="img-inputer__inputer" @change="handleFileChange" />\
                          </form>\
                          <iframe :name="\'uploadIframe\'+inputId" style="display:none" @load="loadIframe" :id="\'uploadIframe_\'+inputId"></iframe>\
                          </template>\
                          <input ref="inputer" v-else type="file" :name="name" :id="inputId" :accept="accept" class="img-inputer__inputer" @change="handleFileChange" />\
                          <transition name="vip-fade">\
                            <div class="img-inputer__err" v-if="errText.length">{{errText}}</div>\
                          </transition>\
                      </div>',
    props: {
        type: {
            default: 'img',
            type: String
        },
        // 默认情况下可能会导致选择框弹出慢的问题，请针对具体化图片类型即可解决
        accept: {
            default: 'image/*,video/*;',
            type: String
        },
        id: {
            default: '',
            type: String
        },
        onChange: {
            default: null,
            type: Function
        },
        readonly: {
            type: Boolean,
            default: false
        },
        readonlyTipText: {
            default: '不可更改',
            type: String
        },
        bottomText: {
            default: '点击图片以修改',
            type: String
        },
        placeholder: {
            default: '',
            type: String
        },
        value: {
            default: undefined
        },
        icon: {
            default: '',
            type: String
        },
        customerIcon: {
            default: '',
            type: String
        },
        maxSize: {
            default: 1024 * 5,
            type: Number
        },
        size: {
            default: '',
            type: String
        },
        imgSrc: {
            default: '',
            type: String
        },
        nhe: {
            type: Boolean,
            default: false
        },
        noMask: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'file'
        },
        bgimage: {
            type: String,
            default: ""
        },
        ajaxUrl: {
            type: String,
            default: ''
        },
        iframeUploadUrl: {
            type: String,
            default: ''
        }

    },
    data: function() {
        return {
            inputId: '',
            file: [],
            dataUrl: '',
            fileName: '',
            errText: '',
            percent: null,
            progressVisible: true,
            XHR_timeout: 1000 * 120,
            ieBate_9: false, //当前IE9版本
        }
    },
    computed: {
        imgSelected: function() {
            return !!this.dataUrl || !!this.fileName;
        },
        sizeHumanRead: function() {
            var rst = 0;
            if (this.maxSize < 1024) {
                rst = this.maxSize + 'K';
            } else {
                rst = (this.maxSize / 1024).toFixed(this.maxSize % 1024 > 0 ? 2 : 0) + 'M';
            }
            return rst;
        },
        sizeClass: function() {
            if (this.size) {
                return "img-inputer--" + this.size;
            }
        },
        themeClass: function() {
            return "img-inputer--" + this.theme;
        },
        bgImgSrc: function() {
            return "url('" + this.bgimage + "')";
        },
        ICON: function() {
            var rst = '';
            if (this.icon) {
                rst = this.icon;
            } else {
                rst = (this.theme === 'light' ? 'img' : 'clip');
            }
            return rst;
        },
        iconUnicode: function() {
            var iconMap = {
                img: '&#xe608;',
                clip: '&#xe626;',
                camera: '&#xe62a;'
            };
            return this.customerIcon || iconMap[this.ICON];
        },
        circleElementRef: function() {
            return 'circleElementRef' + this.inputId;
        },
        progressNumberRef: function() {
            return 'progressNumberRef' + this.inputId;
        },
        ios: function() {
            var ua = navigator.userAgent.toLowerCase();
            var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
            return isIos;
        }
    },
    mounted: function() {

        if (this.imgSrc) {
            this.dataUrl = this.imgSrc;
            this.fileName = true;
        }
        // 阻止浏览器默认的拖拽时事件
        var $this = this;
        ['dragleave', 'drop', 'dragenter', 'dragover'].forEach(function(e) {
            $this.preventDefaultEvent(e);
        });
        // 绑定拖拽时间
        this.addDropSupport();


    },
    created: function() {
        this.inputId = this.id || this.gengerateID();
        this.ieBate();
    },
    methods: {
        ieBate: function() {
            var DEFAULT_VERSION = 10.0;
            var result = false;
            var UA = navigator.userAgent.toLowerCase();
            if (UA.indexOf("msie") > -1) {
                if (UA.match(/msie ([\d.]+)/)[1] < DEFAULT_VERSION) {
                    result = true;
                } else {
                    result = false;
                }
            } else {
                result = false;
            }

            this.ieBate_9 = result;
        },
        preventDefaultEvent: function(eventName) {
            document.addEventListener(eventName, function(e) {
                e.preventDefault();
            }, false);
        },
        addDropSupport: function() {
            var BOX = this.$refs.box;
            var $self = this;
            BOX.addEventListener('drop', function(e) {
                e.preventDefault();
                if ($self.readonly) return false;
                $self.errText = '';
                var fileList = e.dataTransfer.files;
                if (fileList.length === 0) {
                    return false;
                }
                if (fileList.length > 1) {
                    $self.errText = '暂不支持多文件';
                    return false;
                }
                $self.handleFileChange(fileList);
            })
        },
        gengerateID: function() {
            var nonstr = Math.random().toString(36).substring(3, 8);
            if (!document.getElementById(nonstr)) {
                return nonstr;
            } else {
                return this.gengerateID();
            }
        },
        handleFileChange: function(e) {
            if (this.ieBate_9) {
                var formEle = document.getElementById('uploadForm' + this.inputId);
                formEle.submit();
                return false;
            }
            if (typeof e.target === 'undefined') this.file = e[0];
            else this.file = e.target.files[0];
            this.errText = '';
            var size = Math.floor(this.file.size / 1024);
            if (size > this.maxSize) {
                this.errText = "文件大小不能超过" + this.sizeHumanRead;
                return false
            }
            // 双向绑定
            this.$emit('input', this.file);
            // 文件选择回调 && 两种绑定方式
            this.onChange && this.onChange(this.file, this.file.name);
            this.$emit('onChange', this.file, this.file.name);
            this.imgPreview(this.file);
            this.fileName = this.file.name;
            this.ajaxUpload(this.file);
            this.resetInput();

        },
        ajaxUpload: function(files) {
            var formData = new FormData();
            formData.append("file", files);
            var $this = this;
            var xhr = new XMLHttpRequest();
            xhr.timeout = this.XHR_timeout;
            xhr.open('POST', $this.ajaxUrl, true);
            xhr.upload.onprogress = function(e) {
                e = e || event;
                if (e.lengthComputable) {
                    var percent = e.loaded / e.total;
                    if (percent > 0.95) { return false; }
                    $this.progress(percent);
                }
            };
            xhr.ontimeout = function(e) {
                $this.uploadError();
                alert("Sorry，Upload the timeout.")
            };
            xhr.onreadystatechange = function(evt) {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.response);
                    if (data.error_code == 0) {
                        $this.$emit('uploadsuccess', data);
                        $this.progress(1);
                        setTimeout(function() {
                            $this.progressVisible = false;
                        }, 1000);
                        $this.dataUrl = data.data.url;
                    } else {
                        $this.$emit('uploaderror', data);
                        $this.uploadError();
                    }
                }
            };

            xhr.send(formData);
        },
        uploadError: function() {
            this.dataUrl = this.imgSrc;
            this.progressVisible = false;
            this.fileName = '';
            this.errText = '上传失败';
        },
        progress: function(percent) {
            var perimeter = Math.PI * 2 * 18;
            this.percent = percent.toFixed(2);
            document.getElementById(this.circleElementRef).setAttribute('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
            document.getElementById(this.progressNumberRef).innerText = parseInt(this.percent * 100) + '%';
        },
        imgPreview: function(file) {
            var self = this;
            if (!file || !window.FileReader) return;
            if (/^image/.test(file.type)) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    self.dataUrl = this.result;
                }
            }
        },
        resetInput: function() {
            var input = document.getElementById(this.inputId);
            var form = document.createElement('form');
            document.body.appendChild(form);
            var parentNode = input.parentNode;
            // 判断input 是否为最后一个节点
            var isLastNode = parentNode.lastChild === input;
            var nextSibling;
            // 如果后面还有节点，则记录下一个node，做位置标志
            // 如果本身已经是最后一个节点，则直接通过parentNode appendChild即可
            if (!isLastNode) {
                nextSibling = input.nextSibling;
            }
            form.appendChild(input);
            form.reset();
            isLastNode
                ?
                parentNode.appendChild(input) :
                parentNode.insertBefore(input, nextSibling);
            document.body.removeChild(form);
        },
        loadIframe: function(e) {
            var responseText = e.target.contentDocument.body.textContent;
            if(!responseText) return false;
            var responseData = JSON.parse(responseText) || {};
            if (responseData.error_code != 0) {
                this.$emit('uploaderror', responseData);
                this.uploadError();
            } else {
                this.$emit('uploadsuccess', responseData);
                this.dataUrl = responseData.data.url;
            }
  
          },
    },
    watch: {
        imgSrc: function(newval) {
            this.dataUrl = newval;
            if (!newval) {
                this.file = [];
                this.errText = '';
                this.fileName = '';
            }
        },
        value: function(newval, oldval) {
            // 重置逻辑
            if (oldval && !newval) {
                this.file = [];
                this.dataUrl = '';
                this.errText = '';
                this.fileName = '';
            }
        }
    }

})