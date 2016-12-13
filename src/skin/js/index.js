$(document).ready(function(){
      var dgdAd = $('#dgd-ad');
      dgdAd.owlCarousel({
         singleItem:true,
         loop: true,
         autoplay: true,
         autoplayTimeout: 3000,
         autoplayHoverPause: true
      });
      //- var transferList = $('#transfer-list');
      //- var oUl = $('#transfer-list ul');
      //- var aLi = oUl.find('li');
      //- oUl.width( aLi.length * (aLi.eq(0).width() + 20 ) -20 +'px');
      //- var scroll = new BScroll(document.getElementById('transfer-list'), {

      //- })
      var owl = $('#player-list');
      owl.owlCarousel({
            items : 5, //10 items above 1000px browser width
            itemsDesktop : [1000,5], //5 items between 1000px and 901px
            itemsDesktopSmall : [900,4], // betweem 900px and 601px
            itemsTablet: [600,3], //2 items between 600 and 0
            itemsMobile : [480,2] // itemsMobile disabled - inherit from itemsTablet option
        });
      $('.next-btn').click(function () {
         owl.trigger('owl.next');
      })
      $('.prev-btn').click(function () {
        owl.trigger('owl.prev')
      })

    });