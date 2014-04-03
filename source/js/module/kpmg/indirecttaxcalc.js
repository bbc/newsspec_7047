define([
"dutyconversion",
"errormodule"
], function (convertor, errorModule) {

    // Private here
    // Declarations 
    var item;
    // Find duty item from constants
    var findDuty = function (dutiesConstants, inputDuty) {
        var item = null;
        var dutyKey;
        // lookup duty by name i.e. beer.
        if (inputDuty.dutyName !== undefined) {
            dutyKey = inputDuty.dutyName;
        }
        else {
            // concatenate the key by using duty.name and duty.type i.e. vehicleFuel_unleaded
            dutyKey = inputDuty.dutyGroup + '_' + inputDuty.type.toLowerCase();
        }

        item = dutiesConstants[dutyKey];

        return item;
    }

    var calcDuty = function (dutiesConstants, consumptionItem) {

        // Declarations 
        var duty,
        result;

        // Find duty 
        duty = findDuty(dutiesConstants, consumptionItem);

        if (duty !== undefined) {
            result = {
                duty: (duty.rate * convertor.Convert(consumptionItem, dutiesConstants) * duty.periodsPerYear)
            }
        }
        else {
            result = {};
            result.error = errorModule.CreateError(99, "Duty item invalid. Not found in duty list", consumptionItem, consumptionItem.name);
        }
        return result;
    }

    // Calculate duty for an individual consumption item
    var calculateDutyForConsumptionItem = function (dutiesConstants, consumptionItem) {

        // Declarations 
        var result;

        if (consumptionItem.quantity > 0) {
            result = calcDuty(dutiesConstants, consumptionItem);
            if (result.error === undefined) {
                return result;
            }
            else {
                return result;
            }
        }
        return null;
    }

    // Calculates all duty.  iterates through the weeklyConsumption property array and passes each property to
    var calcAllDuty = function (dutiesConstants, weeklyConsumption) {

        // Declarations 
        var duty = {
                duty: {
                    alcohol: 0,
                    fuel: 0,
                    tobacco: 0,
                    vehicleDuty: 0
                },
                errors: []
        };
        calculateDutyRecursive(dutiesConstants, weeklyConsumption, duty);

        return duty;
    }

    var calculateDutyRecursive = function (dutiesConstants, weeklyConsumption, duty) {

        var calcResult;
        for (var i in weeklyConsumption) {
            // itm = Beer, Wine, Spirits etc. from inputs.js
            var consumptionItem = weeklyConsumption[i];

            if (Object.prototype.toString.call(consumptionItem) === '[object Array]') {
                calculateDutyRecursive(dutiesConstants, consumptionItem, duty);
            }
            else {
                // consumptionItem.dutyType = alcohol, fuel  etc   from inputs.js         
                calcResult = calculateDutyForConsumptionItem(dutiesConstants, consumptionItem);
                // returns null if the quantity was 0 and not calculated
                if (calcResult !== null) {
                    if (calcResult.duty !== undefined) {
                        duty.duty[consumptionItem.dutyGroup] += calcResult.duty;
                    }
                    else {
                        // calcResult has an optional property called error.  Where there is no error then it is undefined
                        if (calcResult.error !== undefined) {
                            duty.errors[duty.errors.length] = calcResult.error;
                        }
                    }
                }
            }
        }
    }

    var calculateResults = function (dutiesConstants, weeklyConsumption) {
        var resultsDuty = {};
        resultsDuty = calcAllDuty(dutiesConstants, weeklyConsumption);
        return resultsDuty;
    }

    // Iterates through the property array for the duty result and calculates the difference
    // for each property between 'thisYear' and 'nextYear'
    var calculateDifference = function (resultsThisYear, resultsNextYear) {
        var difference = {
            alcohol: 0,
            fuel: 0,
            tobacco: 0,
            vehicleDuty: 0
        };

        // iterate through property 'array'
        for (var i in difference) {
            var itm = difference[i];
            difference[i] = resultsThisYear[i] - resultsNextYear[i];
        }
        return difference;
    }

    // Public here
    return {
        calculateResults: calculateResults,
        calculateDifference: calculateDifference
    };
});
