define([], function () {

    var calculation = function (vanConstants, person) {


        if (person.companyVans === undefined) return 0;

        var totalBenefit = 0;
        for (var i in person.companyVans) {
            totalBenefit += calculateForVan(vanConstants, person.companyVans[i]);
        }

        return totalBenefit;
    };

    var calculateForVan = function (vanConstants, van) {
        var totalBenefit = 0;


        if (van.privateUsePermitted) {
            totalBenefit += vanConstants.vanBenefit;

            // Only calculate fuel benefit if private user permitted
            if (van.fuelProvided) {
                totalBenefit += vanConstants.vanFuelBenefit;
            }
        }


        return totalBenefit;
    }


    return {
        calculateResults: calculation
    };
});
