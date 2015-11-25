colorList = [
    'f4b300', '78ba00', '2673ec', 'ae113d', '632f00', 'b01e00', '4e0038', 'c1004f',
    '7200ac', '2d004e', '006ac1', '001e4e', '008287', '004d60', '004a00', '00c13f',
    '15992a', 'ff981d', 'e56c19', 'b81b1b', 'ff1d77', 'b81b6c', 'aa40ff', '691bb8',
    '1faeff', '1b58b8', '56c5ff', '569ce3', '00d8cc', '00aaaa', '91d100', 'b81b6c',
    'e1b700', 'd39d09', 'ff76bc', 'e064b7', '00a4a4', 'ff7d23', '4cafb5', '044d91',
    '832772', 'd15a44', 'de971b', '017802', '6e2ea0'],
color = colorList[0];

sizeList = [[400, 400], [400, 300], [800, 600], [1024, 768]];

function loadPhotos(n) {
    for (i = 0; i < n; i++) {
        color = colorList[(colorList.length * Math.random()) >> 0];
        size = sizeList[(sizeList.length * Math.random()) >> 0];
        width = size[0];
        height = size[1];

        waterfall.createBox(width, height, function(box) {
            width = box.offsetWidth;
            height = box.offsetHeight;
            var marginVertical = (box.offsetHeight - height) / 2;
            box.innerHTML = '<div style="background: #' + color + '; width: ' + width + 'px; height: ' + height + 'px; margin: ' + marginVertical + 'px auto;" class="waterfall-box-content"></div>';
        });
    }
}

window.onload = function() {
    waterfall.init('waterfall');
    loadPhotos(5);
};

window.onresize = function() {
    waterfall.resort();
};

window.onscroll = function() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
    windowHeight = document.documentElement.clientHeight,
    documentHeight = document.body.offsetHeight;
    if (windowHeight + scrollTop > documentHeight - 50) {
        loadPhotos(5);
    }
}
