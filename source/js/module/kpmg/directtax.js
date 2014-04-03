define(['childbenefits',
         'statepension',
         'income',
         'taxcredit',
         'incometax',
         'nationalinsurance'
         ], function (childBenefits, statePension, incomeModule, taxCredit, incomeTax, nationalInsurance) {

             var calculation = function (constants, inputs) {

                 var familyOutput = {
                     person: {},
                     spouse: {},
                     overall: {}
                 };

                 var tempFO = statePension.calculateResults(constants.STATEPENSIONS, inputs);

                 familyOutput.person.statePension = tempFO.person.statePension;
                 familyOutput.spouse.statePension = tempFO.spouse.statePension;
                 familyOutput.overall.statePension = tempFO.overall.statePension;

                 familyOutput.childBenefits = childBenefits.calculateResults(constants, inputs, familyOutput);

                 familyOutput.taxCredit = taxCredit.calculateResults(constants, inputs, familyOutput);

                 // income tax module
                 tempFO = incomeTax.calculateResults(constants, inputs, familyOutput);

                 familyOutput.person.tax = tempFO.person.tax;
                 familyOutput.spouse.tax = tempFO.spouse.tax;
                 familyOutput.overall.tax = tempFO.overall.tax;

                 var tempNIRO = nationalInsurance.calculateResults(constants, inputs, familyOutput);

                 familyOutput.person.NI = tempNIRO.person.NI;
                 familyOutput.spouse.NI = tempNIRO.spouse.NI;
                 familyOutput.overall.NI = tempNIRO.overall.NI;

                 if (!inputs.includePartner) {                   
                     familyOutput.spouse.statePension = 0;
                     familyOutput.overall.statePension = familyOutput.person.statePension;
                 } 

                 return familyOutput;
             };

             var calculateDifference = function (thisYear, nextYear) {

                 var results = { spouse: {}, person: {}, overall: {}, taxCredit: 0 };

                 results.childBenefits = childBenefits.calculateDifference(thisYear, nextYear);

                 var tempResults = statePension.calculateDifference(thisYear, nextYear);

                 results.person.statePension = tempResults.person.statePension;
                 results.spouse.statePension = tempResults.spouse.statePension;
                 results.overall.statePension = tempResults.overall.statePension;

                 results.taxCredit = taxCredit.calculateDifference(thisYear, nextYear);

                 tempResults = incomeTax.calculateDifference(thisYear, nextYear);

                 results.person.tax = tempResults.person.tax;
                 results.spouse.tax = tempResults.spouse.tax;
                 results.overall.tax = tempResults.overall.tax;

                 tempResults = nationalInsurance.calculateDifference(thisYear, nextYear);

                 results.person.NI = tempResults.person.NI;
                 results.spouse.NI = tempResults.spouse.NI;
                 results.overall.NI = tempResults.overall.NI;

                 return results;
             };

             return {
                 calculateResults: calculation,
                 calculateDifference: calculateDifference
             };
         });
