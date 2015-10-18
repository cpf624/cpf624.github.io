$(document).ready(function (){
    $('.post-excerpt a, .post-content a').click(function (){
        window.open(this.href, '__blank');
        return false;
    });
});
