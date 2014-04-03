define([
 'income',
], function (income) {

    var calculation = function (constants, inputs, pension) {

        var results = {
            person: {},
            spouse: {},
            overall: {}
        };

        // personal allounce

        var personIncome = 0,
        spouseIncome = 0,
        totalTax = 0;

        var personalAllowanceVal = 0, spouseAllowance = 0;
        var personalTotalIncome = 0, spousalTotalIncome = 0;

        personalTotalIncome = income.grossPersonalIncome(inputs.person, constants) + pension.person.statePension;

      
        spousalTotalIncome = income.grossPersonalIncome(inputs.spouse, constants) + pension.spouse.statePension;

        // married couple allowance
        var mca = 0;


        var topEarnerIsPerson = false;
        if (inputs.person.maritalStatus.type === 'married' || inputs.person.maritalStatus.type === 'civilpartnership') {
            topEarnerIsPerson =  personalTotalIncome > spousalTotalIncome;
        }

        // tax liability
        var personalTax = 0,
        spousalTax = 0;

        var isMcaAllowed = marriedCoupleAllowanceEligibilityRule(constants.INCOME.mca_maxAllowedAge, inputs);
        // storing personalAllowance 2 times to use it later
        var allowance = { personalAllowance: 0, amountRemainingForMarriedCouple: 0, personalAllowanceOriginal: 0 };

        calculatePersonalAndMarriedCouplesAllowance(constants, inputs.person, personalTotalIncome, allowance, isMcaAllowed);

        mca = allowance.amountRemainingForMarriedCouple;

        personalTax = taxLiabilityCalc(constants, inputs.person, personalTotalIncome, pension.person.statePension, allowance);

        if (inputs.includePartner) {

            calculatePersonalAndMarriedCouplesAllowance(constants, inputs.spouse, spousalTotalIncome, allowance, isMcaAllowed);

            if (!topEarnerIsPerson) {
                mca = allowance.amountRemainingForMarriedCouple;
            }

            spousalTax = taxLiabilityCalc(constants, inputs.spouse, spousalTotalIncome, pension.spouse.statePension, allowance);

            if (!topEarnerIsPerson) {

                spousalTax -= mca;
                spousalTax = spousalTax < 0 ? 0 : spousalTax;
            }
        }

        if (topEarnerIsPerson) {
            personalTax -= mca;
            personalTax = personalTax < 0 ? 0 : personalTax;
        }

        totalTax = personalTax + spousalTax; // -mca;

        results.person.tax = personalTax;
        results.spouse.tax = spousalTax;
        results.overall.tax = totalTax < 0 ? 0 : totalTax;

        return results;
    };

    var calculateDifference = function (one, two) {
        return {
            person: { tax: one.person.tax - two.person.tax },
            spouse: { tax: one.spouse.tax - two.spouse.tax },
            overall: { tax: one.overall.tax - two.overall.tax }
        };
    };


    var taxLiabilityCalc = function (constants, person, personalTotalIncome, pension, allowance) {

        var totalTaxLiability = 0;

        var incomebands = constants.INCOME.incomeBands;

        var leftOver = {};

        var nonSavingIncome = income.grossNonSavingIncome(person, constants) + pension;

        totalTaxLiability += taxLiabilityofHead(nonSavingIncome, allowance, incomebands, "Salary", leftOver);

        var interestIncome = income.grossInterestIncome(person, constants);

        totalTaxLiability += taxLiabilityofHead(interestIncome, allowance, incomebands, "Interest", leftOver);

        var grossDivdendIncome = income.grossDividendIncome(person, constants);

        totalTaxLiability += taxLiabilityofHead(grossDivdendIncome, allowance, incomebands, "Dividends", leftOver);

        var divTaxCreditRestriction = 0;

        var divTaxCredit = grossDivdendIncome - parseFloat(person.income.netDividends);

        var nonDividendIncome = interestIncome + nonSavingIncome;

        if (nonDividendIncome < allowance.personalAllowanceOriginal) { // actual PA
            divTaxCreditRestriction = (allowance.personalAllowanceOriginal - nonDividendIncome) * constants.TAXCREDITS.WTC.dividendTaxCreditRate;
            divTaxCredit -= divTaxCreditRestriction;
            if (divTaxCredit < 0)
                divTaxCredit = 0;
        }

        totalTaxLiability = totalTaxLiability - divTaxCredit;

        return totalTaxLiability < 0 ? 0 : totalTaxLiability;
    };

    var calculatePersonalAndMarriedCouplesAllowance = function (constants, person, totalIncome, allowance, isMcaAllowed) {
        var personalAllowance = 0,
        hasEnhancedAllowance = false,
        amountToRestrictPABy = 0,
        amountToAbate = 0,
        amountRemainingForMarriedCouple = constants.INCOME.mca_maximumAllowance;

        if (parseFloat(person.ageInYears) >= 75) {
            personalAllowance = constants.INCOME.pa_personalAllowanceOver74;
            hasEnhancedAllowance = true;
        }
        else if (parseFloat(person.ageInYears) >= 65) {
            personalAllowance = constants.INCOME.pa_personalAllowanceOver64;
            hasEnhancedAllowance = true;
        }
        else {
            personalAllowance = constants.INCOME.pa_basicPersonalAllowance;
        }

        if (hasEnhancedAllowance && personalAllowance > 0) {
            amountToRestrictPABy = (totalIncome - constants.INCOME.pa_personalAllowanceIncomeLimit) / 2;
            if (amountToRestrictPABy > 0) {
                var amtToRestrictMcaBy = amountToRestrictPABy - (personalAllowance - constants.INCOME.pa_basicPersonalAllowance);
                if (amtToRestrictMcaBy > 0) {
                    amountRemainingForMarriedCouple -= amtToRestrictMcaBy;
                }
                personalAllowance -= amountToRestrictPABy;

                if (personalAllowance < constants.INCOME.pa_basicPersonalAllowance) {
                    personalAllowance = constants.INCOME.pa_basicPersonalAllowance;
                }

                if (amountRemainingForMarriedCouple < constants.INCOME.mca_minimumAllowance) {
                    amountRemainingForMarriedCouple = constants.INCOME.mca_minimumAllowance;
                }
            }
        }

        if (totalIncome > constants.INCOME.pa_abatementLevel) {
            amountToAbate = (totalIncome - constants.INCOME.pa_abatementLevel) / 2;
            personalAllowance -= amountToAbate;
            if (personalAllowance < 0)
                personalAllowance = 0;
        }
        allowance.personalAllowance = personalAllowance;
        allowance.personalAllowanceOriginal = personalAllowance;
        if (isMcaAllowed) {
            allowance.amountRemainingForMarriedCouple = amountRemainingForMarriedCouple * constants.INCOME.mca_rate;
        }
        else {
            allowance.amountRemainingForMarriedCouple = 0;
        }
    };

    var taxLiabilityofHead = function (income, allowance, bands, rateIdentifier, leftOver) {

        var localAllowance = 0;
        if (income >= allowance.personalAllowance) {
            localAllowance = allowance.personalAllowance;
            allowance.personalAllowance = 0;
        }
        else {
            localAllowance = income;
            allowance.personalAllowance = allowance.personalAllowance - income;
        }
        var taxLiability = 0;
        var taxbleIncome = income - localAllowance;

        if (taxbleIncome > 0) {
            for (var j = 0; j < bands.length; j++) {
                if (leftOver[j] != 0) {

                    if (leftOver[j] == undefined) {
                        leftOver[j] = bands[j].amount;
                    }
                    if (bands[j].amount == Infinity) {
                        taxLiability += bands[j]["rate" + rateIdentifier] * taxbleIncome;
                        leftOver[j] = 0;
                        break;
                    }
                    if (taxbleIncome >= leftOver[j]) {
                        taxbleIncome -= leftOver[j];
                        taxLiability += bands[j]["rate" + rateIdentifier] * leftOver[j];
                        leftOver[j] = 0;
                    }
                    else {
                        taxLiability += bands[j]["rate" + rateIdentifier] * taxbleIncome;
                        leftOver[j] -= taxbleIncome;
                        break;
                    }
                }
            }
        }

        return taxLiability;
    };

    var marriedCoupleAllowanceEligibilityRule = function (allowedAge, inputs) {
        return (inputs.person.maritalStatus.type === 'married' || inputs.person.maritalStatus.type === 'civilpartnership') &&
               (inputs.person.ageInYears >= allowedAge || (inputs.includePartner && inputs.spouse.ageInYears >= allowedAge))
    };

    return {
        calculateResults: calculation,
        calculateDifference: calculateDifference
    };
});
