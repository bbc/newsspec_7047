define(['bootstrap'], function (news) {

    var init = function () {
        addCloseButtonsToPopups();
        listenForClicks();
        listenForErrors();
    };

    var addCloseButtonsToPopups = function () {
        news.$('.budget_calculator__popups-popup').prepend('<span class="budget_calculator__popups-popup-close">close</span>');
    };

    var listenForClicks = function () {
        news.$('.budget_calculator__popups-popup-link, .budget_calculator__popups-popup-link--table').on('click', function (ev) {
            ev.preventDefault();
            var idSelector = news.$(this).attr('href');
            openPopup(idSelector);
        });

        news.$('.budget_calculator__popups-popup-close').on('click', function (ev) {
            ev.preventDefault();
            closePopups();
        });
    };

    var listenForErrors = function () {
        news.pubsub.on('ns__budget__calculator:error', errorPopup);
    };

    var openPopup = function (panel) {
        closePopups();
        news.$(panel).show();
    };

    var closePopups = function () {
        news.$('.budget_calculator__popups-popup').hide();
    };

    var errorPopup = function () {
        closePopups();
        news.$('.budget_calculator__popups-popup--error').show();
    };
    
    return {
        init: init
    };
});