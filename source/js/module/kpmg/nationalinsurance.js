define([
 'income',
], function (income) {

    var calculation = function (constants, inputs, pension) {

        var niVal = {
            person: { NI: 0 },
            spouse: { NI: 0 },
            overall: { NI: 0 }
        };

        niVal.person.NI = calcNI(inputs.person, constants);

        if (inputs.includePartner) {
            niVal.spouse.NI = calcNI(inputs.spouse, constants);
        }

        niVal.overall.NI = niVal.person.NI + niVal.spouse.NI;

        return niVal;
    };

    var calcNI = function (person, constants) {
        var ni = 0;
        if (nationalInsuranceEligibilityRule(person, constants)) {

            var niClass1 = calcNIForClass(parseFloat(person.income.salary), constants, constants.NI.class1_bands);

            var niClass2 = 0;

            var niClass4 = { total: 0 };
            var niClass4AnnualMax = 0;

            if (person.income.selfEmployment > 0) {
                niClass2 = calcNIForClass2(parseFloat(person.income.selfEmployment), constants, niClass1);
                niClass4 = calcNIForClass(person.income.selfEmployment, constants, constants.NI.class4_bands);
                niClass4AnnualMax = testTwo(constants, niClass1, niClass2, niClass4, person);
            }

            ni = niClass1.total + niClass2 + niClass4AnnualMax;
        }
        return ni;
    }

    var calcNIForClass2 = function (selfEmploymentIncome, constants, niClass1) {
        var ni = 0;
        ni = selfEmploymentIncome < constants.NI.class2_LowerLimit ?
             0 :
             constants.NI.noOf52WeeksInYear * constants.NI.class2WeeklyLimit;

        var combinedClass1and2 = ni + niClass1.total - niClass1.at2_class1;

        var restriction = combinedClass1and2 - constants.NI.niMaxClass1and2Limit > 0 ? combinedClass1and2 - constants.NI.niMaxClass1and2Limit : 0;

        return ni - restriction;
    };

    var testTwo = function (constants, niClass1, niClass2, niClass4, person) {

        var annualMaximum = 0;

        var step1 = constants.NI.niUpperLimit - constants.NI.niLowerLimit;

        var step2 = step1 * constants.NI.class4Rate / 100;

        var step3 = step2 + constants.NI.class2WeeklyLimit * constants.NI.noOf53WeeksInYear;

        var step4 = step3 - parseFloat(niClass1.at12_class1) - parseFloat(niClass2);

        // step4 is +ve, case 1
        var comparativeTotal = parseFloat(niClass1.at12_class1) + parseFloat(niClass2) + parseFloat(niClass4.at9_class4);

        if (step4 > comparativeTotal) {
            annualMaximum = niClass4.total < step4 ? niClass4.total : step4;
            return annualMaximum;
        }
        // step4 is +ve , case 2
        else if (step4 > 0 && step4 < comparativeTotal) {
            //            niClass4.total = niClass4.total - niClass4.at9_class4 + step4;
            //            niClass4.at9_class4 = step4;
            var class4Amt = niClass4.at9_class4 < step4 ? niClass4.at9_class4 : step4
            niClass4.total = niClass4.total - niClass4.at9_class4 + class4Amt;
            niClass4.at9_class4 = class4Amt;
            step4 = class4Amt;
        }
        // step4 is -ve , case 3
        if (step4 < 0) {
            step4 = 0;
        }

        var step5 = step4 * 100 / constants.NI.class4Rate;

        var step6 = constants.NI.niUpperLimit < person.income.selfEmployment ? constants.NI.niUpperLimit : person.income.selfEmployment;

        step6 -= constants.NI.niLowerLimit;

        var step7 = step6 - step5;
        if (step7 < 0)
            step7 = 0;

        var step8 = step7 * constants.NI.HigherRateofClass4and1 / 100;

        var step9 = (person.income.selfEmployment - constants.NI.niUpperLimit) * constants.NI.HigherRateofClass4and1 / 100;

        if (step9 < 0)
            step9 = 0;

        annualMaximum = step4 + step8 + step9;

        return annualMaximum;
    };

    var calcNIForClass = function (taxbleIncome, constants, bands) {

        var niLiability = {}, total = 0;
        if (taxbleIncome >= 0) {

            var accumulated = 0;
            for (var i in bands) {

                var tempNi = 0;
                if (accumulated < taxbleIncome) {
                    tempNi = (taxbleIncome - accumulated < bands[i].amount ? taxbleIncome - accumulated : bands[i].amount) * bands[i].rate / 100;
                    accumulated += bands[i].amount;
                }

                niLiability[bands[i].name] = tempNi;
                total += tempNi;
            }

        }
        niLiability["total"] = total;
        return niLiability;
    }

    var nationalInsuranceEligibilityRule = function (person, constants) {
        var pensionableAge = person.gender.type === "male" ? constants.STATEPENSIONS.qualifyingAgeMale : constants.STATEPENSIONS.qualifyingAgeFemale;

        return parseFloat(person.ageInYears) >= constants.NI.minimumNIAge && parseFloat(person.ageInYears) < pensionableAge;
    }

    var calculateDifference = function (one, two) {
        return pension = {
            person: { NI: one.person.NI - two.person.NI },
            spouse: { NI: one.spouse.NI - two.spouse.NI },
            overall: { NI: one.overall.NI - two.overall.NI }
        };
    };

    return {
        calculateResults: calculation,
        calculateDifference: calculateDifference
    };
});
