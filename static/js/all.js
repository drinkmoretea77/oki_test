jQuery(document).ready(function() {
    $("time.timeago").timeago();
    $.extend(Tipped.Skins, {
        'light': {
            radius: false,
            shadow: true
        }
    });
    Tipped.create("*[title]:not(.skip_tipped)", {
        skin: 'light',
        maxWidth: 500
    });
    $("input[type='checkbox'], input[type='radio']").not(".skip_uniform").uniform();
    $(document).on("ajaxComplete", function() {
        $("time.timeago").timeago();
    });
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });
    $("form.sidebar-search").submit(function(event) {
        event.preventDefault();
    });
    $("form.sidebar-search input[type='text']").on("input", function(event) {
        var search_value = $(this).val();
        $(".page-sidebar span.title.search-result, .page-sidebar ul.sub-menu a.search-result").removeClass("search-result");
        $(".page-sidebar li:not(.sidebar-toggler-wrapper).hide, .page-sidebar ul.sub-menu.hide").removeClass("hide");
        $(".page-sidebar li.nav-item.active").removeClass("active");
        if (search_value.length > 0) {
            $(".page-sidebar span.title:contains('" + search_value + "'), .page-sidebar ul.sub-menu a:contains('" + search_value + "')").each(function() {
                $(this).addClass("search-result");
            });
            $(".page-sidebar li:not(.sidebar-search-wrapper, .sidebar-toggler-wrapper), .page-sidebar ul.sub-menu").each(function() {
                if ($(this).find(".search-result").length == 0) {
                    $(this).addClass("hide");
                }
            });
            $(".page-sidebar li.nav-item:not(hide)").addClass("active");
        }
    });
});

function escapeHtml (string) {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}
