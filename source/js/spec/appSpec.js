define(['lib/news_special/bootstrap', 'app', 'spec/fixtureData', 'spec/testData'],  function (news, app, fixtureData, testData) {

    describe('setting up the tests', function () {
        it('should populate the page and run javascript', function () {
            news.$('body').append(fixtureData);
            // delay before running the app to give jQuery time to add elements to the DOM.
            // without this, news.$('.js').show() in app.js gets swallowed up, amongst other things.
            setTimeout(function () {
                app.init();
            }, 100);
        });

        it('should wait for all events to be registered, etc', function () {
            waits(1000);
        });
    });

    describe('form appearance and behaviour', function () {
        it('should show the first panel by default', function () {
            expect(onPanelNumber(1)).toBeTruthy();
        });

        it('should update results when checking "include partner" checkbox', function () {
            var resultsUpdated = false;
            news.pubsub.on('ns__budget__calculator:results:updated', function () {
                resultsUpdated = true;
            });

            news.$('.ns__budget__calculator-event-onclick').click();
            expect(resultsUpdated).toBeTruthy();
        });

        it('should update results on key up', function () {
            var resultsUpdated = false;
            news.pubsub.on('ns__budget__calculator:results:updated', function () {
                resultsUpdated = true;
            });
            news.$('#beer').keyup();
            expect(resultsUpdated).toBeTruthy();
        });
    });

    describe('the form navigation', function () {
        it('should have a working "Next" button', function () {
            startingFromPanel(1);
            news.$('.ns__budget__calculator-localnav-next').click();
            expect(onPanelNumber(2)).toBeTruthy();
        });

        it('should have a working "Back" button', function () {
            startingFromPanel(2);
            news.$('.ns__budget__calculator-localnav-prev').click();
            expect(onPanelNumber(1)).toBeTruthy();
        });

        it('should respond to menu icons being clicked directly', function () {
            startingFromPanel(3);
            news.$('.budget_calculator__nav-list-item--5').click();
            expect(onPanelNumber(5)).toBeTruthy();
        });

        it('should have a working "Start Again" button', function () {
            startingFromPanel(5);
            news.$('.results_back_btn').click();
            expect(onPanelNumber(1)).toBeTruthy();
        });
    });

    describe('the calculator\'s calculations', function () {
        it('should match the KPMG outputs', function () {
            var index = testData.test.length,
                data;
            while (index-- > 0) {
                data = testData.test[index];
                resetToDefaultValues();
                performCalculation(data.inputs);
                expect(ourResult()).toEqual(data.expectedResult);
                break;
            }
        });
    });

    var startingFromPanel = function (panelNumber) {
        news.$('.ns__budget__calculator-page').hide();
        news.$('.ns__budget__calculator-page--' + panelNumber).show();
    };

    var onPanelNumber = function (panelNumber) {
        return panelShowing(panelNumber) && allPanelsHiddenExcept(panelNumber);
    };

    var panelShowing = function (panelNumber) {
        return news.$('.ns__budget__calculator-page--' + panelNumber).css('display') === 'block';
    };

    var allPanelsHiddenExcept = function (panelShowing) {
        var panelsAreHidden = true;
        news.$('.ns__budget__calculator-page:not(.ns__budget__calculator-page--' + panelShowing + ')').each(function () {
            if (news.$(this).css('display') !== 'none') {
                panelsAreHidden = false;
            }
        });
        return panelsAreHidden;
    };

    var performCalculation = function (unprocessedInputs) {
        var inputs = fillInTheBlanks(unprocessedInputs);

        checkTheNecessaryBoxes(inputs);

        // form 1
        updateField('#beer',                            inputs.alcohol.beer);
        updateField('#wine',                            inputs.alcohol.wine);
        updateField('#spirits',                         inputs.alcohol.spirits);
        updateField('#cigarettes',                      inputs.alcohol.cigarettes);
        // form 2
        updateField('#status',                          inputs.you.details.status);
        updateField('#children',                        inputs.you.details.children);
        updateField('#yourage',                         inputs.you.details.age);
        updateField('#yourgender',                      inputs.you.details.gender);
        updateField('#yourhoursworked',                 inputs.you.details.hours);
        updateField('#partnerage',                      inputs.partner.details.age);
        updateField('#partnergender',                   inputs.partner.details.gender);
        updateField('#partnerhoursworked',              inputs.partner.details.hours);
        // form 3
        updateField('#yoursalary',                      inputs.you.income.salary);
        updateField('#yourselfemployment',              inputs.you.income.selfEmployment);
        updateField('#yourdividends',                   inputs.you.income.dividends);
        updateField('#yourinterest',                    inputs.you.income.interest);
        updateField('#yourrental',                      inputs.you.income.rental);
        updateField('#yourpension',                     inputs.you.income.pension);
        updateField('#partnersalary',                   inputs.partner.income.salary);
        updateField('#partnerselfemployment',           inputs.partner.income.selfEmployment);
        updateField('#partnerdividends',                inputs.partner.income.dividends);
        updateField('#partnerinterest',                 inputs.partner.income.interest);
        updateField('#partnerrental',                   inputs.partner.income.rental);
        updateField('#partnerpension',                  inputs.partner.income.pension);
        // form 4
        updateField('#car1emission',                    inputs.you.transport.car.emission);
        updateField('#fuel',                            inputs.you.transport.car.fuel);
        updateField('#fuelType',                        inputs.you.transport.car.fuelType);
        updateField('#car2emission',                    inputs.partner.transport.car.emission);
        updateField('#fuel2',                           inputs.partner.transport.car.fuel);
        updateField('#fuelType2',                       inputs.partner.transport.car.fuelType);
        updateField('#companycar_listprice',            inputs.you.transport.company.car.listPrice);
        updateField('#companycar_emissions',            inputs.you.transport.company.car.emission);
        updateField('#companycar_diesel',               inputs.you.transport.company.car.diesel);
        updateField('#companycar_fuelprovided',         inputs.you.transport.company.car.fuelProvided);
        updateField('#companyvan_privateuse',           inputs.you.transport.company.van.privateUse);
        updateField('#companyvan_fuelprovided',         inputs.you.transport.company.van.fuelProvided);
        updateField('#partner_companycar_listprice',    inputs.partner.transport.company.car.listPrice);
        updateField('#partner_companycar_emissions',    inputs.partner.transport.company.car.emission);
        updateField('#partner_companycar_diesel',       inputs.partner.transport.company.car.diesel);
        updateField('#partner_companycar_fuelprovided', inputs.partner.transport.company.car.fuelProvided);
        updateField('#partner_companyvan_privateuse',   inputs.partner.transport.company.van.privateUse);
        updateField('#partner_companyvan_fuelprovided', inputs.partner.transport.company.van.fuelProvided);

        news.pubsub.emit('ns__budget__calculator:results:updated');
    };

    // allows us to pass in undefined json variables without complaint.
    // otherwise we'd have to create empty objects in the test data.
    var fillInTheBlanks = function (inputs) {
        inputs.alcohol                       = inputs.alcohol || {};
        inputs.you                           = inputs.you || {};
        inputs.you.details                   = inputs.you.details || {};
        inputs.you.income                    = inputs.you.income || {};
        inputs.you.transport                 = inputs.you.transport || {};
        inputs.you.transport.car             = inputs.you.transport.car || {};
        inputs.you.transport.company         = inputs.you.transport.company || {};
        inputs.you.transport.company.car     = inputs.you.transport.company.car || {};
        inputs.you.transport.company.van     = inputs.you.transport.company.van || {};
        inputs.partner                       = inputs.partner || {};
        inputs.partner.details               = inputs.partner.details || {};
        inputs.partner.income                = inputs.partner.income || {};
        inputs.partner.transport             = inputs.partner.transport || {};
        inputs.partner.transport.car         = inputs.partner.transport.car || {};
        inputs.partner.transport.company     = inputs.partner.transport.company || {};
        inputs.partner.transport.company.car = inputs.partner.transport.company.car || {};
        inputs.partner.transport.company.van = inputs.partner.transport.company.van || {};
        // we check the value of this as a boolean, so should default to a boolean and not an object.
        inputs.includeCompanyCars            = inputs.includeCompanyCars || false;
        return inputs;
    };

    var checkTheNecessaryBoxes = function (inputs) {
        includePartnerCheck(inputs.you.details.status);
        checkBox('#have_companycar', inputs.includeCompanyCars);
    };

    var updateField = function (selector, value) {
        if (typeof value !== 'undefined') {
            // booleans are for checkboxes only
            if (typeof value === 'boolean') {
                checkBox(selector, value);
            }
            // this isn't a boolean, so must be a text input.
            else {
                news.$(selector).val(value);
            }
        }
    };

    var includePartnerCheck = function (status) {
        if (status === 'single' || status === 'divorced') {
            checkBox('#includepartner', false);
        } else {
            checkBox('#includepartner', true);
        }
    };

    var checkBox = function (id, shouldBeIncluded) {
        var alreadyIncluded = news.$(id).is(':checked');
        if (alreadyIncluded && !shouldBeIncluded || !alreadyIncluded && shouldBeIncluded) {
            news.$(id).click();
        }
    };

    var resetToDefaultValues = function () {
        performCalculation(testData.reset.inputs);
    };

    var ourResult = function () {
        return news.$('.budget_calculator__result_overview-amount').html();
    };
});