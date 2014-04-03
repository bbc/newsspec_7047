define(['bootstrap'], function (news) {

    var currentSection = 1;

    var getCurrentSection = function () {
        return currentSection;
    };

    var init = function () {
        addNavigationButtons();
        listenForNavigationUpdated();
        listenForClicks();
        news.pubsub.emit('ns__budget__calculator:navigation', [1]);
    };

    var addNavigationButtons = function () {
        news.$('.budget_calculator__form').append('<div class="ns__budget__calculator-localnav"></div>');
        news.$('.ns__budget__calculator-localnav').append('<a href="#" class="ns__budget__calculator-localnav-prev">Back</a>');
        news.$('.ns__budget__calculator-localnav').append('<a href="#" class="ns__budget__calculator-localnav-next">Next</a>');
    };

    var listenForNavigationUpdated = function () {
        news.pubsub.on('ns__budget__calculator:navigation:updated', function (page) {
            currentSection = page;
            updateNavigationAppearance();
            resetLocalNavigationToDefaultAppearance();
            tweakLocalNavigationAppearanceIfNecessary();
        });
    };

    var updateNavigationAppearance = function () {
        news.$('.budget_calculator__nav-list-item').removeClass('selected');
        news.$('.budget_calculator__nav-list-item--' + currentSection).addClass('selected');
    };

    var resetLocalNavigationToDefaultAppearance = function () {
        news.$('.ns__budget__calculator-localnav').show();
        news.$('.ns__budget__calculator-localnav-prev').show();
        news.$('.ns__budget__calculator-localnav-next').html('Next');
        news.$('.budget_calculator__result_overview').removeClass('budget_calculator__result_overview-page5');
    };

    var tweakLocalNavigationAppearanceIfNecessary = function () {
        if (currentSection === 1) {
            news.$('.ns__budget__calculator-localnav-prev').hide();
        }
        else if (currentSection === 4) {
            news.$('.ns__budget__calculator-localnav-next').html('Results');
        }
        else if (currentSection === 5) {
            news.$('.ns__budget__calculator-localnav').hide();
            news.$('.budget_calculator__result_overview').addClass('budget_calculator__result_overview-page5');
        }
    };

    var listenForClicks = function () {
        news.$('.budget_calculator__nav-list-item').on('click', function () {
            var listItemClass = news.$(this).attr('class'),
                section = parseInt(listItemClass.replace(/^\D+/g, ''), 10);
            
            news.pubsub.emit('istats', ['section clicked', section]);
            news.pubsub.emit('ns__budget__calculator:navigation', [section, currentSection]);
        });

        news.$('.ns__budget__calculator-localnav-next').on('click', function (ev) {
            ev.preventDefault();
            news.pubsub.emit('istats', ['Next button clicked from section ' + currentSection, true]);
            nextNavSelected();
        });

        news.$('.ns__budget__calculator-localnav-prev').on('click', function (ev) {
            ev.preventDefault();
            news.pubsub.emit('istats', ['Prev button clicked from section ' + currentSection, true]);
            prevNavSelected();
        });

        news.$('.results_back_btn').on('click', function (ev) {
            ev.preventDefault();
            news.pubsub.emit('istats', ['Start Again button clicked.', true]);
            resultBackButtonClicked();
        });
    };

    var nextNavSelected = function () {
        news.pubsub.emit('ns__budget__calculator:navigation', [(currentSection + 1), currentSection]);
    };
    
    var prevNavSelected = function () {
        news.pubsub.emit('ns__budget__calculator:navigation', [(currentSection - 1), currentSection]);
    };
    
    var resultBackButtonClicked = function (ev) {
        news.pubsub.emit('ns__budget__calculator:navigation', [1, currentSection]);
    };

    return {
        currentSection: getCurrentSection,
        init: init
    };
});