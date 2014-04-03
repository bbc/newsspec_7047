define(function () {

    var obj = {

        resultsThisYear: {
            duty: {
                alcohol: 0,
                fuel: 0,
                tobacco: 0,
                vehicleDuty: 0
            },

            taxCredit: 0,
            childBenefits: 0,

            person: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            spouse: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            overall: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            total: 0
        },

        resultsNextYear: {
            duty: {
                alcohol: 0,
                fuel: 0,
                tobacco: 0,
                vehicleDuty: 0
            },

            taxCredit: 0,
            childBenefits: 0,
            statePension: 0,

            person: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            spouse: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            overall: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            total: 0
        },

        difference: {
            duty: {
                alcohol: 0,
                fuel: 0,
                tobacco: 0,
                vehicleDuty: 0
            },

            taxCredit: 0,
            childBenefits: 0,

            person: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            spouse: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            overall: {
                tax: 0,
                NI: 0,
                statePension: 0
            },

            total: 0
        },

        // A JSON array of Error objects
        errors: [
            {   // Integer error code for each error type
                errorCode: 1,
                // Generic message for error code
                errorMsg: "Error Message",
                // Object on which the error have have been detected
                errorType: Object,
                // property which raised the error.
                errorSource: "property"
            }]
    }
    return obj;
});
