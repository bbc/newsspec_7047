define([], function () {

    var calculation = function (companyCarsConstants, person) {

        if (person.companyCars === undefined) return 0;

        var totalBenefit = 0;
        for (var i in person.companyCars) {
            totalBenefit += calculateForCar(companyCarsConstants, person.companyCars[i]);
        }
        return totalBenefit;
    };

    var calculateForCar = function (companyCarsConstants, car) {
        var band,
        benefitPercentage,
        totalBenefit;

        for (i in companyCarsConstants.band) {
            if (car.co2Emissions >= companyCarsConstants.band[i].co2Min && car.co2Emissions <= companyCarsConstants.band[i].co2Max) {
                band = companyCarsConstants.band[i]; break;
            }
        }

        if (band == undefined) return 0;

        if (band.stepSize > 0) {
            benefitPercentage = band.percentageStart + (parseInt(((car.co2Emissions - band.co2Min) / band.stepSize)) * band.stepPercentageIncrease);
        }
        else {
            benefitPercentage = band.percentageStart;
        }

        if (car.isDiesel) {
            benefitPercentage += companyCarsConstants.dieselSurcharge;
        }

        if (benefitPercentage > companyCarsConstants.maxBenefitPercentage) {
            benefitPercentage = companyCarsConstants.maxBenefitPercentage;
        }

        totalBenefit = car.listPrice * (benefitPercentage / 100);


        if (car.fuelProvided) {
            totalBenefit += (companyCarsConstants.carFuelBenefit * (benefitPercentage / 100));
        }
        return totalBenefit;
    };


    return {
        calculateResults: calculation
    };
});
