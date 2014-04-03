define([
        'companycars',
        'companyvans'], function (companyCars, companyVans) {

            var calculation = function (constants, inputs, results) {
            };

            var calculateDifference = function (one, two) {
                // two - one
                var difference;

                return difference;
            };

            var grossUpAmount = function (amount, rate) {
                return amount * (1 / (1 - rate));
            };
           
            var grossPersonalIncome = function (person, constants) {
                return grossNonSavingIncome(person, constants) + grossDividendIncome(person, constants) + grossInterestIncome(person, constants);
            };

            var grossNonSavingIncome = function (person, constants) {

                return grossSalaryIncome(person, constants) +
                       parseFloat(person.income.nonStatePension) +
                       parseFloat(person.income.rental);
            };

            var grossSalaryIncome = function (person, constants) {

                var carBenefit, vanBenefit;

                carBenefit = companyCars.calculateResults(constants.COMPANYCAR, person);

                vanBenefit = companyVans.calculateResults(constants.COMPANYVAN, person);

                return parseFloat(person.income.salary) +
                       parseFloat(person.income.selfEmployment) +
                       parseFloat(carBenefit) +
                       parseFloat(vanBenefit);
            };

            var grossInvestmentIncome = function (person, constants, pension) {
                return grossInterestIncome(person, constants) +
                       grossDividendIncome(person, constants) +
                       parseFloat(person.income.nonStatePension) +
                       parseFloat(person.income.rental) + parseFloat(pension);
            };

            var grossInterestIncome = function (person, constants) {
                return grossUpAmount(parseFloat(person.income.netInterest), constants.TAXCREDITS.WTC.lowestRate);
            };

            var grossDividendIncome = function (person, constants) {
                return grossUpAmount(parseFloat(person.income.netDividends), constants.TAXCREDITS.WTC.dividendTaxCreditRate);
            };

            // only to be called for include partner calcs.
            var grossTotalIncome = function (inputs, constants, pension) {

                return grossPersonalIncome(inputs.person, constants) +
                       grossPersonalIncome(inputs.spouse, constants) + pension;
            };

            return {
                calculateResults: calculation,
                calculateDifference: calculateDifference,
//                grossUpDividend: grossUpAmount,
//                grossUpInterest: grossUpAmount,

                grossInvestmentIncome: grossInvestmentIncome,
                grossSalaryIncome: grossSalaryIncome,
                grossPersonalIncome: grossPersonalIncome,
                grossInterestIncome: grossInterestIncome,
                grossDividendIncome: grossDividendIncome,
                grossNonSavingIncome: grossNonSavingIncome
            };
        });
