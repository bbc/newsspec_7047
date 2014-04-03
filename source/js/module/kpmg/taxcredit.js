define([
 'income',
], function (income) {

    var wtcAlreadyRestricted = 0;
    var calculation = function (constants, inputs, pension) {

        var taxCredit = 0,
        disallowedWtc = 0,
        calcFamilyElementWithChildElement = constants.TAXCREDITS.CTCFamilyElement.calcFamilyElementWithChildElement,
        totalIncome = 0;

        var isQualifiedForWtc = qualifiesForWtc(inputs, constants.TAXCREDITS);

        totalIncome = grossDisregardedIncome(inputs, constants, pension);
        taxCredit += calculateWtc(constants.TAXCREDITS, inputs, totalIncome, isQualifiedForWtc);
        // From 2012/13 40000 family element protection is removed        
        taxCredit += calculateCtc(constants.TAXCREDITS, inputs, totalIncome, calcFamilyElementWithChildElement, isQualifiedForWtc);
        if (!calcFamilyElementWithChildElement)
            taxCredit += calculateCtcFamilyElement(constants.TAXCREDITS, inputs, totalIncome);

        return taxCredit;
    };

    var grossDisregardedIncome = function (inputs, constants, pension) {

        var totalGrossSalary = 0,
        totalInvIncome = 0;

        totalInvIncome += income.grossInvestmentIncome(inputs.person, constants, pension.person.statePension);
        totalGrossSalary += income.grossSalaryIncome(inputs.person, constants);

        //tax credit always considers spousal income if present.
        totalInvIncome += income.grossInvestmentIncome(inputs.spouse, constants, pension.spouse.statePension);
        totalGrossSalary += income.grossSalaryIncome(inputs.spouse, constants);

        totalInvIncome = totalInvIncome - constants.INCOME.incomeDisregarded < 0 ? 0 : totalInvIncome - constants.INCOME.incomeDisregarded;

        return totalGrossSalary + totalInvIncome;
    };

    var calculateDifference = function (yearOne, yearTwo) {
        return yearTwo.taxCredit - yearOne.taxCredit;
    };

    var getAbatedIncome = function (income, threshold, rate) {
        var disallowedAmount = 0,
            allowedIncome = 0;
        allowedIncome = income - threshold;
        if (allowedIncome > 0) {
            disallowedAmount = allowedIncome * rate;
        }
        return disallowedAmount;
    };

    var calculateWtc = function (tcConstants, inputs, totalIncome, isQualifiedForWtc) {

        var wtcAmount = 0,
        maxWtc,
        wtcDisallowed;

        if (isQualifiedForWtc) {
            maxWtc = getMaxWtc(tcConstants, inputs);
            wtcDisallowed = getAbatedIncome(totalIncome, tcConstants.WTC.thresholdLevel, tcConstants.WTC.withdrawalRate);
            wtcAmount = maxWtc - wtcDisallowed;
            //for usage in child tax credit calc
            wtcAlreadyRestricted = wtcDisallowed > maxWtc ? maxWtc : wtcDisallowed;
        }
        return wtcAmount < 0 ? 0 : wtcAmount;
    };

    var getMaxWtc = function (tcConstants, inputs) {
        var maxWtc = 0;
        maxWtc = tcConstants.WTC.basicElementAmt;
        maxWtc += loneParentRule(inputs) ? tcConstants.WTC.loneParentElementAmt : 0;
        maxWtc += personIsWithPartner(inputs) ? tcConstants.WTC.secondAdultElementAmt : 0;
        maxWtc += hours30PlusRule(inputs) || workingCoupleWithChildRule(inputs.person, inputs.spouse) ? tcConstants.WTC.hours30PlusElementAmt : 0;

        return maxWtc;
    };

    var getChildTaxCreditThresholdRate = function (tcConstants, isQualifiedWTC) {
        var maxAllowedThreshold = 0;
        //TODO: Check if we need to return  thresholdIfWtcLevel for isQualifiedWTC true
        if (isQualifiedWTC) {
            maxAllowedThreshold = tcConstants.CTC.thresholdIfWtcLevel + (wtcAlreadyRestricted / tcConstants.WTC.withdrawalRate);
            if (maxAllowedThreshold < tcConstants.CTC.thresholdLevel)
                maxAllowedThreshold = tcConstants.CTC.thresholdLevel;
            return maxAllowedThreshold;
        }
        //return tcConstants.CTC.thresholdLevel;
        else
            return tcConstants.CTC.thresholdLevel;
    };

    var calculateCtc = function (tcConstants, inputs, totalIncome, calcFamilyElementWithChildElement, isQualifiedForWtc) {

        var ctcAmount = 0,
        maxChildElement,
        maxCtcAmt,
        thresholdRate = 0,
        ctcDisallowed;

        if (inputs.person.children > 0) {
            thresholdRate = getChildTaxCreditThresholdRate(tcConstants, isQualifiedForWtc);
            maxChildElement = tcConstants.CTC.childElementAmt * inputs.person.children;
            //this rule applies from 2012/13
            maxCtcAmt = calcFamilyElementWithChildElement ? maxChildElement + tcConstants.CTCFamilyElement.maxFamilyElementAmt : maxChildElement;

            ctcDisallowed = getAbatedIncome(totalIncome, thresholdRate, tcConstants.CTC.withdrawalRate);
            ctcAmount = maxCtcAmt - ctcDisallowed;
        }
        return ctcAmount < 0 ? 0 : ctcAmount;
    };

    var calculateCtcFamilyElement = function (tcConstants, inputs, totalIncome) {

        var ctcFamilyAmount = 0,
        maxFamilyElementAmt;

        if (inputs.person.children > 0) {
            maxFamilyElementAmt = tcConstants.CTCFamilyElement.maxFamilyElementAmt;
            if (totalIncome <= tcConstants.CTCFamilyElement.incomeThresholdLevel) {
                return maxFamilyElementAmt;
            }
            else {
                ctcFamilyDisallowedAmt = getAbatedIncome(totalIncome, tcConstants.CTCFamilyElement.incomeThresholdLevel, tcConstants.CTCFamilyElement.withdrawalRate);
                ctcFamilyAmount = maxFamilyElementAmt - ctcFamilyDisallowedAmt;
            }
        }
        return ctcFamilyAmount < 0 ? 0 : ctcFamilyAmount;
    };

    // Wtc qualification rules
    var noChildrenAgeLessThan60 = function (person, children, constants) {
        return person.ageInYears >= 25 && person.averageWeeklyWorkingHours >= 30;
    };

    var noChildrenAgeMoreThan60 = function (person, children, constants) {
        return person.ageInYears >= 60 && person.averageWeeklyWorkingHours >= 16;
    };

    var hasChildrenAgeMoreThan16 = function (person, children, constants) {
        var qualifies = false;
        qualifies = children > 0 && person.ageInYears >= 16 && person.averageWeeklyWorkingHours >= 16;
        if (qualifies && constants.WTC.includeLoneParentInRule) {
            qualifies = (person.maritalStatus.type === 'single' || person.maritalStatus.type === 'divorced');
        }
        return qualifies;
    };

    var hasChildrenAgeMoreThan16Two = function (inputs, children, constants) {
        //this rule applies from 2012/13
        return constants.WTC.includeWithChildrenAgeMoreThan16Two &&
        children > 0
        && personIsWithPartner(inputs)
        && inputs.person.ageInYears >= 16

        && (
            (parseFloat(inputs.person.averageWeeklyWorkingHours) + parseFloat(inputs.spouse.averageWeeklyWorkingHours)) >= 24
            && (inputs.person.averageWeeklyWorkingHours >= 16 || inputs.spouse.averageWeeklyWorkingHours >= 16)
            );
    };
    // end Wtc qualification rules

    var taxCreditQualificationRules = [noChildrenAgeLessThan60, noChildrenAgeMoreThan60];

    var qualifiesForWtc = function (inputs, constants) {
        var qualifies = false;
        qualifies = isPersonQualifiedForWtc(inputs.person, inputs.person.children, constants) ||
                     hasChildrenAgeMoreThan16(inputs.person, inputs.person.children, constants) ||
                     hasChildrenAgeMoreThan16Two(inputs, inputs.person.children, constants);
        if (!qualifies) { // then check if the spouse qualifies
            qualifies = isPersonQualifiedForWtc(inputs.spouse, inputs.person.children, constants) ||
             hasChildrenAgeMoreThan16(inputs.spouse, inputs.person.children, constants) ||
             hasChildrenAgeMoreThan16Two(inputs, inputs.person.children, constants);
        }        
        return qualifies;
    };

    var isPersonQualifiedForWtc = function (person, children, constants) {

        var qualified = false;
        for (i = 0; i < taxCreditQualificationRules.length; i++) {
            qualified |= taxCreditQualificationRules[i](person, children, constants);
        }
        return qualified;
    };

    // Following rules used to calculate max Wtc allowed
    var loneParentRule = function (inputs) {
        return inputs.person.children > 0
        && (inputs.person.maritalStatus.type === 'single' || inputs.person.maritalStatus.type === 'divorced');
    };

    var personIsWithPartner = function (inputs) {
        return (inputs.person.maritalStatus.type === 'married' || inputs.person.maritalStatus.type === 'civilpartnership' || inputs.person.maritalStatus.type === 'cohabiting');
    };

    var hours30PlusRule = function (inputs) {
        return inputs.person.averageWeeklyWorkingHours >= 30 || inputs.spouse.averageWeeklyWorkingHours >= 30;
    };

    var workingCoupleWithChildRule = function (person, spouse) {
        return (parseFloat(person.averageWeeklyWorkingHours) + parseFloat(spouse.averageWeeklyWorkingHours)) >= 30
        && person.children > 0
        && (person.averageWeeklyWorkingHours >= 16 || spouse.averageWeeklyWorkingHours >= 16);
    };
    // end Wtc rules

    return {
        calculateResults: calculation,
        calculateDifference: calculateDifference
    };
});
