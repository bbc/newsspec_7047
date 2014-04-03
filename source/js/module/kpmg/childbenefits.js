define([
 'income',
], function (income) {

    var calculationFacade = function (constants, inputs, pension) {
        return calculation(constants, inputs, pension);
    };

    var highestEarning = 0;
    var calculation = function (constants, inputs, pension) {

        var reductioninPeriod = 0;

        var qualifies = incomeIsBelowThresholdLevel(constants, inputs, pension);
        if (!qualifies)
            reductioninPeriod = constants.CHILDBENEFITS.weeksTobeChargedAtNewRule;

        var childBenefits = 0;

        var noChildren = inputs.person.children;
        if (noChildren <= 0) {
            return childBenefits;
        }
        // child benefit amount for first 39 weeks (or 52 if not dissallowing any of the benefit)
        childBenefits = (constants.CHILDBENEFITS.eldestChildRate + (noChildren - 1) * constants.CHILDBENEFITS.otherChildRate) * (constants.CHILDBENEFITS.weeksInYear - reductioninPeriod);
        // new rule
        if (!qualifies) {

            var restOfBenefitAmount = (constants.CHILDBENEFITS.eldestChildRate + (noChildren - 1) * constants.CHILDBENEFITS.otherChildRate) * (reductioninPeriod);
            
            var percentageToReduceChildBenefits = parseInt((highestEarning - constants.CHILDBENEFITS.incomeThreshold) / 100);

            restOfBenefitAmount = restOfBenefitAmount * (100 - percentageToReduceChildBenefits) / 100;
            if (restOfBenefitAmount > 0)
                childBenefits += restOfBenefitAmount;
        }

        return childBenefits;
    };

    var incomeIsBelowThresholdLevel = function (constants, inputs, pension) {

        highestEarning = 0;

        var incomePerson = income.grossPersonalIncome(inputs.person, constants) + pension.person.statePension;
        var incomeSpouse = income.grossPersonalIncome(inputs.spouse, constants) + pension.spouse.statePension;

        if (incomePerson > constants.CHILDBENEFITS.incomeThreshold || incomeSpouse > constants.CHILDBENEFITS.incomeThreshold) {
            highestEarning = incomePerson;

            if (incomeSpouse > highestEarning)
                highestEarning = incomeSpouse;
        }

        return highestEarning <= 0;
    }


    var calculateDifference = function (resultsThisYear, resultsNextYear) {
        return resultsNextYear.childBenefits - resultsThisYear.childBenefits;
    };

    return {
        calculateResults: calculationFacade,
        calculateDifference: calculateDifference
    };
});
