$(function(){
    var app = window.app ;
    app.menu = new app.Menu() ;

    setTimeout(function() {
        app.menu.show() ;
    }, 200) ;

    $('.menu-item').on('click', showContent) ;

    function showContent(e) {
        var iframe = $('#item-frame') ;

        var url = $(this).attr('data-href') ;
        if ( !url ) {
            iframe.attr('src', url)
                .animate( { top: 100, height: 0}) ;
        }
        else {
            // make sure the background is white (and not transparent)
            iframe.attr('src', url)
                .animate( { top: 20, height: '100%'})
                .load(function() {
                    this.contentDocument.body.style.backgroundColor = '#fff' ;
                }) ;
        }

        /*
         //parent.frames[FrameID].window.location.reload();
         */
        app.menu.hideItems() ;
        return false ;
    }
})
