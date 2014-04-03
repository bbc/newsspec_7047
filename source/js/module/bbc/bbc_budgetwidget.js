define(['bootstrap', 'kpmgmodule_widget', 'display', 'inputsgenerator', 'updateInputs'], function (news, KPMGCalc, Display, inputsGenerator, InputUpdater) {

    var Inputs = {},
        FORM_ID = news.$('.main__form')[0],
        cta = news.$('.main__cta a');

    var init = function () {
        Inputs = inputsGenerator.getInputs();
        addFormEventListeners();
        updateResults();
        news.pubsub.emit('ns__budget__calculator:viewport:desktop', [false]);
        updateResults();
    };

    var addFormEventListeners = function () {
        news.$('input').on('keyup', function () {
            updateResults();
        });
        cta.on('click', function (ev) {
            ctaLinkClicked();
        });
    };

    var updateResults = function () {
        Inputs = InputUpdater.updateInputsWithFormFields(FORM_ID, Inputs, false, false);
        Display.displayResult(KPMGCalc.calculateResults(Inputs));
    };

    // when promo link is clicked, add query string to it
    var ctaLinkClicked = function () {
        var b = Inputs.weeklyConsumption.beer.quantity,
            w = Inputs.weeklyConsumption.wine.quantity,
            s = Inputs.weeklyConsumption.spirits.quantity,
            c = Inputs.weeklyConsumption.cigarettes.quantity,
            qs = '#b=' + b + '&w=' + w + '&c=' + c + '&s=' + s,
            link = cta.attr('href') + qs;
        
        cta.attr('href', link);
    };

    return {
        init: init
    };
});