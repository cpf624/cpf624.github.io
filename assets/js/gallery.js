var gallery = {};
gallery.init = function(wrapId, meta) {
    this.wrap = document.getElementById(wrapId);
    if (this.wrap == undefined) {
        return null;
    }

    var _meta = {
        box: {
            width: 20,
            height: 20,
            space: 10
        },
        mark: {
            fulluse: false,
            step: 5
        }
    };

    if (meta == undefined) {
        meta = _meta;
    } else {
        if (meta.box == undefined) {
            meta.box = _meta.box;
        } else {
            if (isNaN(meta.box.width)) {
                meta.box.width = _meta.box.width;
            }
            if (isNaN(meta.box.height)) {
                meta.box.height = _meta.box.height;
            }
        }

        if (meta.mark == undefined) {
            meta.mark = _meta.mark;
        } else {
            if (isNaN(meta.mark.step)) {
                meta.mark.step = _meta.mark.step;
            }
            if (meta.mark.fulluse == undefined) {
                meta.mark.fulluse = _meta.mark.fulluse;
            } else {
                meta.mark.fulluse = meta.mark.fulluse ? true : false;
            }
        }
    }

    this.meta = meta;
    this.boxs = [];

    this.preset();
    return this;
};

gallery.preset = function() {
    var offsetWidth = $(document).width();
    this.cols = offsetWidth / this.meta.box.width >> 0;
    if ((offsetWidth - (this.cols * this.meta.box.width)) < 50) {
        this.cols -= 1;
    }
    this.wrap.style.width = this.cols * this.meta.box.width + "px";

    this.marks = [];
    this.markLastLine = 0;

    this.maxY = 0;
};

gallery.resort = function() {
    this.preset();
    this.sort(this.boxs);
};

gallery.createBox = function(width, height, callback) {
    width += this.meta.box.space;
    height += this.meta.box.space;

    var box = document.createElement('div');
    box.className = 'gallery-box';

    var nx = Math.ceil(width / this.meta.box.width);
    var ny = Math.ceil(height / this.meta.box.height);
    width = nx * this.meta.box.width - this.meta.box.space;
    height = ny * this.meta.box.height - this.meta.box.space;
    nx = (nx > this.cols) ? this.cols : nx;

    box.style.width = width + 'px';
    box.style.height = height + 'px';

    var d = {
        nx: nx, ny: ny,
        // width: width, height: height,
        wrap: box
    };
    this.sort(d);
    this.boxs.push(d);

    this.wrap.appendChild(box);
    callback(box);
};

gallery.sort = function(box) {
    if (box instanceof Array) {
        for (var i = 0; i < box.length; i++) {
            this.sort(box[i]);
        }
        return;
    }

    var x = 0, y = this.markLastLine;
    while (true) {
        while (true) {
            if (y >= this.marks.length) {
                this.newMarks();
                x = 0;
            }

            while (x < this.cols) {
                if (this.marks[y][x] == 0) {
                    break
                }
                x++;
            }

            if (this.marks[y][x] == 1 || (x + box.nx) > this.cols) {
                y++;
                x = 0;
                continue;
            }

            break;
        }

        var overlap = false;
        for (var j = y; j < y + box.ny; j++) {
            if (j >= this.marks.length) {
                this.newMarks();
            }
            for (var k = x; k < x + box.nx; k++) {
                if (this.marks[j][k] == 1) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) {
                break;
            }
        }

        if (overlap) {
            x = 0;
            y++;
            continue;
        } else {
            break;
        }
    }

    // box.x = x;
    // box.y = y;
    for (var j = y; j < y + box.ny; j++) {
        if (j >= this.marks.length) {
            this.newMarks();
        }
        for (var k = x; k < x + box.nx;k++) {
            this.marks[j][k] = 1;
        }
    }

    if (!this.meta.mark.fulluse) {
        for (var j = this.marks.length - 1; j > this.markLastLine; j--) {
            var marked = true;
            for (var k = 0; k < this.cols; k++) {
                if (this.marks[j][k] != 1) {
                    marked = false;
                    break;
                }
            }
            if (marked) {
                this.markLastLine = j;
                break;
            }
        }
    }

    var maxY = y + box.ny;
    if (maxY > this.maxY) {
        this.maxY = maxY;
    }
    this.wrap.style.height = this.meta.box.height * this.maxY + 'px';

    var left = this.meta.box.width * x,
        top = this.meta.box.height * y;
    box.wrap.style.position = 'absolute';
    box.wrap.style.left = left + 'px';
    box.wrap.style.top = top + 'px';
};

gallery.newMarks = function() {
    for (var i = 0; i < this.meta.mark.step; i++) {
        var r = new Array(this.cols);
        for (var j = 0; j < this.cols; j++) {
            r[j] = 0;
        }
        this.marks.push(r);
    }
};
