(function(ns, $) {
   var Menu = function() {
       $('#menu').addClass('to-back').css('display', 'block') ;    // prepare menu container
   } ;
   Menu.prototype = {
       show: function(){
           $('#menu-button')
               .on('transitionend', menuButtonAnimateStep1)
               .on('click', this.showItems.bind(this))
               .addClass('step1') ;                             // begin
           $('#menu').addClass('init') ;                        // show small left part of the menu items

       }
       , hideItems: function() {
            $('.menu-item').removeClass('show-item-step2').addClass('show-item-step1');
            $('.menu-item').on('transitionend', hideItems) ;

       }
       , showItems: function(){
            $('.menu-item').on('transitionend', showItemsLastStep)
                .each(function() {
                    $(this).css({'-webkit-transition-delay': Math.floor(Math.random() * 200) + 'ms'}) ;
                })
                .addClass('show-item-step1') ;
       }
    } ;

    function hideItems(e) {
        if ( $('#menu').hasClass('to-front')) {
            $('#menu').removeClass('to-front').addClass('to-back') ;
        }
        $(this).removeClass('show-item-step1')
            .off('transitionend', hideItems) ;

    }
    function showItemsLastStep(e) {
        var $self = $(this) ;
        if ( $self.hasClass('show-item-step1') ) {
            $self.removeClass('show-item-step1')
                .addClass('show-item-step2') ;
            var $menu = $('#menu') ;
            if ( $menu.hasClass('to-back') ) {
                $menu.removeClass('to-back').addClass('to-front') ;
            }
            $self.off('transitionend', showItemsLastStep) ;
        }
    }
/*
    function initMenuItems(e) {
        if ( e.originalEvent.propertyName === 'left') {
              $(this).removeClass('initialize').addClass('ready-state') ;
              $('#menu').addClass('show') ;
        }
    }
    */
    function menuButtonAnimateStep1(e) {
        if ( e.originalEvent.propertyName === 'left') {
            $(this).off('transitionend', menuButtonAnimateStep1) ;
            $(this).on('transitionend', menuButtonAnimateStep2) ;

            $(this).removeClass('step1').addClass('step2') ;
        }
    }

    function menuButtonAnimateStep2() {
        $(this).off('transitionend', menuButtonAnimateStep2) ;
    }

   ns.Menu = Menu ;
})(window.app, window.jQuery) ;