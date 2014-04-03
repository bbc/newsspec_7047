/*

@TODO - this needs a lot of refactoring.

*/
define(['bootstrap'], function (news) {

    var tempIncludePartner = false,
        tempIncludeCompanyCar = false;

    var init = function () {
        listenForResize();
        listenForClicks();
    };

    var listenForResize = function () {
        news.pubsub.on('ns__budget__calculator:viewport:desktop', function (desktop) {
            var fieldsEnabled = true;
            if (desktop) {
                fieldsEnabled = false;
                news.$('.ns__budget__calculator-page-fieldset--optional').show();
            } else {
                news.$('.ns__budget__calculator-page-fieldset--optional').hide();
            }
            toggleFields(fieldsEnabled);

            news.pubsub.emit('ns__budget__calculator:results:updated');
        });
    };

    var listenForClicks = function () {
        news.$('.ns__budget__calculator-event-onclick').on('click', function () {
            var inputID = news.$(this).attr('id'),
                functionToCall = (inputID === 'have_companycar') ? includeCompanyCar : includePartnerHandler;

            functionToCall(inputID);
            news.pubsub.emit('ns__budget__calculator:results:updated');
        });
        
        news.$('.budget_calculator__form-toggle').on('click', function (ev) {
            ev.preventDefault();
            toggleFieldset(news.$(this).attr('href'));

            // sometimes we want to toggle multiple fieldsets
            var extraFieldset = news.$(this).attr('data-extra-fieldset');
            if (typeof extraFieldset !== 'undefined') {
                toggleFieldset(extraFieldset);
            }
            
            news.$(this).toggleClass('budget_calculator__form-toggle--open');
        });
    };

    var toggleFields = function (fieldsEnabled) {
        togglePartnerFields(fieldsEnabled);
        toggleCarFields(fieldsEnabled);
    };
    
    var togglePartnerFields = function (checkboxVal) {
        tempIncludePartner = checkboxVal;
        var FORM_ID = formID();
        FORM_ID.includepartner.checked = checkboxVal;
        FORM_ID.includepartner2.checked = checkboxVal;
        FORM_ID.includepartner3.checked = checkboxVal;

        // style partner fieldsets to show it is disabled
        if (checkboxVal === true) {
            enableFieldset('#budget_calculator__form-fieldset--about_your_partner');
            enableFieldset('#budget_calculator__form-fieldset--partner_income');
            enableFieldset('#budget_calculator__form-fieldset--partner_car');
            includePartnerCompanyCar();
        } else {
            disableFieldset('#budget_calculator__form-fieldset--about_your_partner');
            disableFieldset('#budget_calculator__form-fieldset--partner_income');
            disableFieldset('#budget_calculator__form-fieldset--partner_car');
            disableFieldset('#budget_calculator__form-fieldset--partner_company_car');
            disableFieldset('#budget_calculator__form-fieldset--partner_company_van');
            enableIncludePartnerCheckboxes();
        }
    };
    
    var toggleCarFields = function (checkboxVal) {
        tempIncludeCompanyCar = checkboxVal;
        if (checkboxVal === true) {
            enableFieldset('#budget_calculator__form-fieldset--company_car');
            enableFieldset('#budget_calculator__form-fieldset--company_van');
            includePartnerCompanyCar();
        } else {
            // if company car is disabled then keep all values in fields but send 0 for calculations
            disableFieldset('#budget_calculator__form-fieldset--company_car');
            disableFieldset('#budget_calculator__form-fieldset--company_van');
            disableFieldset('#budget_calculator__form-fieldset--partner_company_car');
            disableFieldset('#budget_calculator__form-fieldset--partner_company_van');
        }
    };
    
    var enableFieldset = function (id) {
        news.$(id).removeClass('disabled');
        news.$(id + ' input, ' + id + ' select').removeAttr('disabled');
    };
    
    var disableFieldset = function (id) {
        news.$(id).addClass('disabled');
        news.$(id + ' input, ' + id + ' select').attr('disabled', 'disabled');
    };
    
    // Now that partner checkboxes are inside fieldset this function removes the disabled attribute that was set in disableFieldset()
    function enableIncludePartnerCheckboxes() {
        news.$('#includepartner, #includepartner2, #includepartner3').removeAttr('disabled');
    }



    function includeCompanyCar(checkboxId) {
        var FORM_ID = formID();
        var checkboxVal = FORM_ID[checkboxId].checked;
        toggleCarFields(checkboxVal);
    }

    // enable/disable fields for partner details 
    function includePartnerHandler(checkboxId) {
        var FORM_ID = formID();
        // get checkbox value of clicked checkbox then set all 3 "include partner" checkboxes to this value
        var checkboxVal = FORM_ID[checkboxId].checked;
        togglePartnerFields(checkboxVal);
    }

    function toggleFieldset(fieldsetID) {
        news.$(fieldsetID).toggle();
    }

    // if company car checkbox is selected then enable else disable
    function includePartnerCompanyCar() {
        if (tempIncludeCompanyCar && tempIncludePartner) {
            enableFieldset('#budget_calculator__form-fieldset--partner_company_car');
            enableFieldset('#budget_calculator__form-fieldset--partner_company_van');
        } else {
            disableFieldset('#budget_calculator__form-fieldset--partner_company_car');
            disableFieldset('#budget_calculator__form-fieldset--partner_company_van');
        }
    }

    var includePartnerStatus = function () {
        return tempIncludePartner;
    };

    var includeCompanyCarStatus = function () {
        return tempIncludeCompanyCar;
    };

    var formID = function () {
        return news.$('.budget_calculator__form')[0];
    };

    return {
        init: init,
        FORM_ID: formID,
        includePartner: includePartnerStatus,
        includeCompanyCar: includeCompanyCarStatus
    };
});