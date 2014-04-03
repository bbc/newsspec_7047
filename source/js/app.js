define(['bootstrap', 'lib/news_special/share_tools/controller', 'bbc_budgetwidget', 'bbc_budgetcalculator'], function (news, shareTools, widget, calculator) {

    return {
        init: function (storyPageUrl) {
            news.$('.nojs').hide();
            news.$('.js').show();

            var thisIsTheWidget = window.bbc_budgetwidget || false;

            if (thisIsTheWidget) {
                widget.init();
            } else {
                calculator.init();
                shareTools.init('.share_budget_results', storyPageUrl, {
                    app: 'budgetcalculator2013',
                    // the below message gets updated dynamically through filling in the form
                    message: 'Budget calculator: How will Budget 2013 affect you?',
                    hashtag: [
                        'bbcbudgetcalculator'
                    ]
                });
            }

            news.pubsub.emit('istats', ['App initiated', true]);
        }
    };

});