$(function(){

    var $menu = $('.menu li')
        ,$visual = $('#vis').position().top
        ,sec1Pos = $('#sec1').position().top //뒤에 데이터값
        ,sec2Pos = $('#sec2').position().top
        ,sec3Pos = $('#sec3').position().top
        ,sec4Pos = $('#sec4').position().top


    var clude = function(){

        var index = $(this).index()

//        $menu.eq(index).addClass('on')
//        $menu.eq(index).siblings().removeClass('on')

    }

    $menu.click(clude)

    var scroll = function(){

        var nowScroll = $window.scrollTop()

        if(nowScroll >= $visual && nowScroll < sec1Pos){
            $menu.removeClass('on')
            $menu.eq(0).addClass('on')
        }
        else if(nowScroll >= sec1Pos && nowScroll < sec2Pos){
            $menu.siblings().removeClass('on')
            $menu.eq(1).addClass('on')
        }
        else if(nowScroll >= sec2Pos && nowScroll < sec3Pos){
            $menu.siblings().removeClass('on')
            $menu.eq(2).addClass('on')
        }
        else if(nowScroll>=sec3Pos){
            $menu.siblings().removeClass('on')
            $menu.eq(3).addClass('on')
        }
        else if(nowScroll>=sec4Pos){
            $menu.siblings().removeClass('on')
            $menu.eq(3).addClass('on')
        }

    }//scroll move
    $(window).scroll(scroll)



})






