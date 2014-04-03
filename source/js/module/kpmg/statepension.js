define([], function () {

    var calculation = function (statePensionConstants, inputs) {

        var person = inputs.person,
        spouse = inputs.spouse,
        pension = {
            person: { statePension: 0 },
            spouse: { statePension: 0 },
            overall: { statePension: 0 }
        };

        var canPersonGetPension = canGetPension(statePensionConstants, person);
        var canSpouseGetPension = canGetPension(statePensionConstants, spouse);

        //  If a person is treated as married and has included details for their partner then we will calculate the spouse element of the pension
        //  It is the income and / or  income Tax modules which decides whether to use the spouse element of the pension.
    
        // If neither are entitled to pension return 0
        if (!(canPersonGetPension || canSpouseGetPension))
            return pension;

        // If person is entitled to pension
        if (canPersonGetPension) {

            // Person gets main part of pension 
            pension.person.statePension = statePensionConstants.pensionSingle;

            // If treated as married and spouse can get pension then spouse gets married part of pension
            if (treatAsMarried(person) && canSpouseGetPension) {
                pension.spouse.statePension = statePensionConstants.pensionMarried;
            } // If treated as not married and spouse can get pension then spouse gets full single pension
            else if (!(treatAsMarried(person)) && canSpouseGetPension) {
                pension.spouse.statePension = statePensionConstants.pensionSingle;               
            }

        }  // if person not entitled but spouse is entitled
        else if (canSpouseGetPension) {
            // if treated as married spouse gets nothing
            if (treatAsMarried(person)) {
                return pension;
            }  // if not treated as married spouse gets single person pension
            else {
                pension.spouse.statePension = statePensionConstants.pensionSingle;              
            }
        }

        if (canGetExtraPension(statePensionConstants, person)) {
            pension.person.statePension += statePensionConstants.pensionExtra;
        }

        // if spouse can get extra pension
         if (canGetExtraPension(statePensionConstants, spouse)) {
            pension.spouse.statePension += statePensionConstants.pensionExtra;
        }
     
        pension.overall.statePension = pension.person.statePension + pension.spouse.statePension;

        return pension;
    };

    var canGetPension = function (statePensionConstants, person) {
        if (person === undefined || person === null || person.gender.type === null)
            return false;

        if (person.gender.type.toLowerCase() === "male") {
            return person.ageInYears >= statePensionConstants.qualifyingAgeMale;
        }
        else {
            return person.ageInYears >= statePensionConstants.qualifyingAgeFemale;
        }
    };

    var canGetExtraPension = function (statePensionConstants, person) {
        if (person == undefined || person == null)
            return false;

        return person.ageInYears >= statePensionConstants.pensionExtraAge;
    };


    var treatAsMarried = function (person) {
        return (person.maritalStatus.type.toLowerCase() === "married" || person.maritalStatus.type.toLowerCase() === "civilpartnership");
    }

    var calculateDifference = function (resultsThisYear, resultsNextYear) {

        return pension = {
            person: { statePension: resultsNextYear.person.statePension - resultsThisYear.person.statePension },
            spouse: { statePension: resultsNextYear.spouse.statePension - resultsThisYear.spouse.statePension },
            overall: { statePension: resultsNextYear.overall.statePension - resultsThisYear.overall.statePension }
        };
    };


    return {
        calculateResults: calculation,
        calculateDifference: calculateDifference
    };
});
