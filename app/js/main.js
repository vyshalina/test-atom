$(document).ready(function() {
    //MENU
    $('.js-open-btn').click(function() {
        $('.wrapp_main-menu').toggleClass('active');
    });
    $('.close-btn').click(function() {
        $('.wrapp_main-menu').toggleClass('active');
        return false;
    });
    //#MENU

    //TOP SEARCH
    $('.wrapp_header-nav .header-right .show-search').click(function() {
        $('.wrapp_header-nav .header-right form.search').toggleClass('active');
    });
    //#TOP SEARCH

    //TABS
    var tab = $('.js-tabs .js-tabs-items > div'); 
    tab.hide().filter(':first').show(); 
    
    // Клики по вкладкам.
    $('.js-tabs .js-tabs-nav a').click(function(){
        tab.hide(); 
        tab.filter(this.hash).show(); 
        $('.js-tabs .js-tabs-nav a').removeClass('active');
        $(this).addClass('active');
        return false;
    }).filter(':first').click();

    // Клики по якорным ссылкам.
    $('.tabs-target').click(function(){
        $('.js-tabs .js-tabs-nav a[href=' + $(this).data('id')+ ']').click();
    });
    //#TABS


});

//Скрываем меню, кликая вне его зоны
$(document).mouseup(function (e) {
    var menuBlock = $(".wrapp_main-menu .main-menu"),
        closeBtn = $(".wrapp_main-menu .main-menu a.close-btn");
    if (!menuBlock.is(e.target) && menuBlock.has(e.target).length === 0){
        $('.wrapp_main-menu').removeClass('active');
    }
});

//Скрываем понск, кликая вне его зоны
$(document).mouseup(function (s) {
    var searchBlock = $(".wrapp_header-nav .header-right form.search");
    if (!searchBlock.is(s.target) && searchBlock.has(s.target).length === 0){
        $('.wrapp_header-nav .header-right form.search').removeClass('active');
    }
});

