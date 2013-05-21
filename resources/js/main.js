$(function(){
    var app = window.app ;
    app.menu = new app.Menu() ;

    setTimeout(function() {
        app.menu.show() ;
    }, 200) ;

    $('.menu-item').on('click', showContent) ;

    function showContent(e) {
        var url = $(this).attr('data-href') ;
        $('#item-frame').attr('src', url)
            .animate( { top: 20, height: '100%'}) ;

        /*
         //parent.frames[FrameID].window.location.reload();
         */
        app.menu.hideItems() ;
        return false ;
    }
})
