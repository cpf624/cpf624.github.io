function getScrollBarWidth() {
    var width = window.browserScrollbarWidth;
    if (width === undefined) {
      var body = document.body, div = document.createElement('div');
      div.innerHTML = '<div style="width: 50px; height: 50px; position: absolute; left: -100px; top: -100px; overflow: auto;"><div style="width: 1px; height: 100px;"></div></div>';
      div = div.firstChild;
      body.appendChild(div);
      width = window.browserScrollbarWidth = div.offsetWidth - div.clientWidth;
      body.removeChild(div);
    }
    return width;
};

function Gallery(id, meta) {
    this.id = id;
    var wrap = this.getWrap();
    if (!wrap) {
        return null;
    }
    if (!(wrap.hasClass('gallery'))) {
        wrap.addClass('gallery');
    }

    var _meta = {box: {switchTime: 2000},
        slide: {showTime: 5000, switchTime: 2000}};
    if (meta == undefined) {
        meta = _meta;
    } else {
        if (meta.slide == undefined) {
            meta.slide = _meta.slide;
        } else {
            if (isNaN(meta.slide.showTime)) {
                meta.slide.showTime = _meta.slide.showTime;
            }
        }
    }
    this.meta = meta;

    this.boxs = [];
    this.width = $(document.body).width() - getScrollBarWidth();
    this.height = 0;
    wrap.width(this.width);

    this.isShow = false;
    this.isFirstShow = true;
    this.activeBoxIndex = 0;
    this.activeBoxStep = 1;

    $('html, body').animate({scrollTop: wrap.offset().top}, meta.box.switchTime);

    window.onresize = (function(gallery) {
        return function() {
            gallery.resize();
        };
    })(this);

    return this;
};

Gallery.prototype.getWrap = function() {
    return $('#' + this.id);
};

Gallery.prototype.show = function() {
    if (this.boxs.length <= 1 || this.isShow) {
        return;
    }

    this.isShow = true;
    var activeBox = this.boxs[this.activeBoxIndex];
    var waitTime = activeBox.showTime;
    if (!this.isFirstShow) {
        var slide;
        waitTime = 0;
        if (activeBox.activeSlideStep > 0) {
            for (var i = activeBox.activeSlideIndex + 1; i < activeBox.slides.length; i++) {
                slide = activeBox.slides[i];
                waitTime += slide.showTime + slide.switchTime;
            }
        } else {
            for (var i = 0; i < activeBox.activeSlideIndex; i++) {
                slide = activeBox.slides[i];
                waitTime += slide.showTime + slide.switchTime;
            }
        }
        activeBox.show(this, true);
    }

    this.timeoutId = setTimeout((function(gallery) {
        return function showBox() {
            if (!gallery.isShow) {
                return;
            }

            gallery.activeBoxIndex += gallery.activeBoxStep;
            if (gallery.activeBoxIndex == 0 || gallery.activeBoxIndex == (gallery.boxs.length - 1)) {
                gallery.activeBoxStep *= -1;
            }

            var box = gallery.boxs[gallery.activeBoxIndex];
            var boxWrap = $('#' + box.id);
            $('html, body').animate({scrollTop: boxWrap.offset().top}, box.switchTime);
            box.show(gallery);
            gallery.timeoutId = setTimeout(showBox, box.showTime);
        };
    })(this), waitTime);

    this.isFirstShow = false;
};

Gallery.prototype.resize = function() {
    var width = $(document.body).width() - getScrollBarWidth(), height = 0;
    var scale = width / this.width;
    this.width = width;
    var wrap = this.getWrap();
    wrap.width(this.width);

    for (var i = 0; i < this.boxs.length; i++) {
        var box = this.boxs[i], boxWrap = box.getWrap();
        var boxHeight = boxWrap.height() * scale;

        boxWrap.width(this.width);
        boxWrap.height(boxHeight);
        height += boxHeight;

        var slideLeft = 0;
        for (var j = box.activeSlideIndex; j < box.slides.length; j++) {
            var slide = box.slides[j];
            var slideWrap = $('#' + slide.id);

            slideWrap.offset({left: slideLeft});
            slideLeft += this.width;
        }
    }

    this.height = height;
    wrap.height(this.height);

    var box = this.boxs[this.activeBoxIndex], boxWrap = box.getWrap();
    $('html, body').animate({scrollTop: boxWrap.offset().top}, box.switchTime);
};

Gallery.prototype.stop = function() {
    this.isShow = false;
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
    this.boxs[this.activeBoxIndex].stop();
};

Gallery.prototype.createBox = function(boxData) {
    var galleryWrap = this.getWrap(), boxId = 'gallery-box-' + this.boxs.length;
    galleryWrap.append('<div id="' + boxId + '" class="gallery-box"></div>');

    var box = new GalleryBox(boxId), boxWrap = box.getWrap();
    boxWrap.width(this.width);

    box.switchTime = (!isNaN(boxData.switchTime) && boxData.switchTime > 0)
        ? boxData.switchTime : this.meta.box.switchTime;
    var slideLeft = 0, boxHeight = 0;
    for (var i = 0; i < boxData.slides.length; i++) {
        var slideData = boxData.slides[i];
        var slideId = boxId + '-slide-' + i;
        boxWrap.append('<div id="' + slideId + '" class="gallery-box-slide"></div>');
        var slideWrap = $('#' + slideId);

        slideWrap.offset({left: slideLeft});
        slideWrap.append('<img class="gallery-box-slide-content" src="' + slideData.url + '" />');

        var slide = {id: slideId};
        slide.switchTime = (!isNaN(slideData.switchTime) && slideData.switchTime > 0)
            ? slideData.switchTime : this.meta.slide.switchTime;
        slide.showTime = (!isNaN(slideData.showTime) && slideData.showTime > 0)
            ? slideData.showTime : this.meta.slide.showTime;
        box.slides.push(slide);

        box.showTime += slide.showTime + slide.switchTime;

        slideLeft += this.width;
        var slideHeight = this.width / slideData.width * slideData.height;
        if (slideHeight > boxHeight) {
            boxHeight = slideHeight;
        }
    }


    boxWrap.height(boxHeight);
    this.height += boxHeight;
    galleryWrap.height(this.height);

    this.boxs.push(box);
};

function GalleryBox(id) {
    this.id = id;
    this.showTime = 0;
    this.switchTime = 0;
    this.slides = [];

    this.isShow = false;
    this.activeSlideIndex = 0;
    this.activeSlideStep = 1;
};

GalleryBox.prototype.getWrap = function() {
    return $('#' + this.id);
};

GalleryBox.prototype.show = function(gallery, reshow) {
    if (this.slides.length <= 1 || this.isShow) {
        return;
    }

    this.isShow = true;
    var activeSlide = this.slides[this.activeSlideIndex];
    this.timeoutId = setTimeout((function(box, gallery) {
        return function showSlide() {
            if (!box.isShow) {
                return;
            }

            var slideNextIndex = box.activeSlideIndex + box.activeSlideStep;
            var slide = box.slides[box.activeSlideIndex];
            var slideNext = box.slides[slideNextIndex];
            var slideWrap = $('#' + slide.id);
            var slideNextWrap = $('#' + slideNext.id);

            slideWrap.offset({left: 0});
            slideNextWrap.offset({left: gallery.width * box.activeSlideStep});
            slideNextWrap.css('display', 'block');
            slideWrap.animate({left: -gallery.width * box.activeSlideStep}, slide.switchTime, function() {
                slideWrap.hide();
            });
            slideNextWrap.animate({left: 0}, slide.switchTime, function() {
                box.activeSlideIndex = slideNextIndex;
            });

            if (slideNextIndex == 0 || slideNextIndex == (box.slides.length - 1)) {
                box.activeSlideStep *= -1;
                box.stop();
            } else {
                box.timeoutId = setTimeout(showSlide, slide.showTime + slide.switchTime);
            }
        };
    })(this, gallery), reshow ? 0: activeSlide.showTime + activeSlide.switchTime);
};

GalleryBox.prototype.stop = function() {
    this.isShow = false;
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
};
