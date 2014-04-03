define([
            "thisyearconstants",
            "nextyearconstants",
            "genericvalidator",
            "indrecttaxcalc",
            "childbenefits",
            "statepension",
            "companycars",
            "companyvans",
            "directtax"
], function (thisYearConstants, nextYearConstants, validator, indirectTaxCalc, childBenefits, statePension, companyCars, companyVans, directTax) {

    var CalculateAllModules = function (constants, inputs) {
        var resultsForYear = {};

        var dutyResults = indirectTaxCalc.calculateResults(constants.DUTIES, inputs.weeklyConsumption);
        resultsForYear = directTax.calculateResults(constants, inputs);
        resultsForYear.duty = dutyResults.duty;

        if (typeof resultsForYear.errors === 'undefined'){
            resultsForYear.errors = [];
        }
        
        for (err in dutyResults.errors) {
            resultsForYear.errors.push(dutyResults.errors[err]);
        }

        resultsForYear.total = 0;
        return resultsForYear;
    };

    var CalculateDifference = function (thisYear, nextYear) {
        var results = {};
        var duty = indirectTaxCalc.calculateDifference(thisYear.duty, nextYear.duty);
        results = directTax.calculateDifference(thisYear, nextYear);
        results.duty = duty;

//        for (err in dutyResults.errors) {
//            results.errors[results.errors.length] = dutyResults.errors[err];
//        }

        results.total = calculateTotal(results);
        return results;
    };

    var calculateTotal = function (results) {
        var total = isNaN(results) ? 0 : parseFloat(results);
        for (i in results) {
            if (i === "overall")
                continue;
            total += calculateTotal(results[i]);
        }
        return total;
    };


    var CalculateAllModulesForBothYears = function (inputs, outputs) {
        var results = {};
        results.errors = validator.IsValid(inputs);
        validator.Clear();
        if (results.errors.length == 0) {
            results.resultsThisYear = CalculateAllModules(thisYearConstants, inputs);
            results.resultsNextYear = CalculateAllModules(nextYearConstants, inputs);
            results.difference = CalculateDifference(results.resultsThisYear, results.resultsNextYear);

        }
        return results;
    }

    // Public here
    return {
        calculateResults: CalculateAllModulesForBothYears
    };
});
