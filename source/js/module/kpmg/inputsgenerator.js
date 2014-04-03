define([], function (inputs) {

    var getCarsObjectForVehicleDuty = function (type) {
        return {
            quantity: 1,
            dutyGroup: "vehicleDuty",
            type: type,
            validTypes: getVehicleDutyTypes(),
            validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
        };
    };

    var getVehicleFuelObject = function (quantity, type) {
        return {
            quantity: quantity,
            type: type,
            validTypes: getVehicleFuelTypes(),
            dutyGroup: "fuel",
            validation: [{ propertyName: "quantity", dataType: "positivenumber" },
                               { propertyName: "type", dataType: "string"}]
        };
    };

    var getVehicleDutyTypes = function () {
        return [{ name: "nocar", display: "No Car" }, { name: "low", display: "Low" }, { name: "medium", display: "Medium" }, { name: "high", display: "High" }, { name: "veryhigh", display: "Very High"}];
    };

    var getVehicleFuelTypes = function () {

        return [{ name: "unleaded", display: "Unleaded" }, { name: "diesel", display: "Diesel" }, { name: "lpg", display: "LPG"}];
    };

    var getInputs = function () {
        return {
            weeklyConsumption: {
                beer: {
                    name: "Beer",
                    quantity: 0,
                    dutyName: "beer",
                    dutyGroup: "alcohol",
                    validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
                },

                wine: {
                    name: "Wine",
                    quantity: 0,
                    dutyName: "wine",
                    dutyGroup: "alcohol",
                    validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
                },

                spirits: {
                    name: "Spirits",
                    quantity: 0,
                    dutyName: "spirits",
                    dutyGroup: "alcohol",
                    validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
                },

                cigarettes: {
                    name: "Tobacco",
                    quantity: 0,
                    dutyName: "tobacco",
                    dutyGroup: "tobacco",
                    validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
                },

                vehicleFuel: [],
                cars: []
            },

            person: {
                gender: {
                    type: null,
                    validTypes: getGenderType(),
                    validation: [{ propertyName: "type", dataType: "string"}]
                },

                ageInYears: 0,

                averageWeeklyWorkingHours: 0,

                children: 0,

                validation: [{ propertyName: "ageInYears", dataType: "positiveWholeNumber" },
                     { propertyName: "averageWeeklyWorkingHours", dataType: "positivenumber" },
                     { propertyName: "children", dataType: "positiveWholeNumber" }
        ],

                maritalStatus: {
                    type: null,
                    validTypes: getMaritalStatus(),
                    validation: [{ propertyName: "type", dataType: "string"}]
                },

                income: {
                    salary: 0,
                    selfEmployment: 0,
                    netDividends: 0,
                    netInterest: 0,
                    rental: 0,
                    nonStatePension: 0,
                    validation: [{ propertyName: "salary", dataType: "positivenumber" },
                         { propertyName: "selfEmployment", dataType: "positivenumber" },
                         { propertyName: "netDividends", dataType: "positivenumber" },
                         { propertyName: "netInterest", dataType: "positivenumber" },
                         { propertyName: "rental", dataType: "positivenumber" },
                         { propertyName: "nonStatePension", dataType: "positivenumber" }
            ]
                },

                companyCars: [],

                companyVans: [{
                    privateUsePermitted: false,
                    fuelProvided: false
                }]

            },

            includePartner: false,

            spouse: {
                gender: {
                    name: "Gender",
                    type: null,
                    validTypes: getGenderType(),
                    validation: [{ propertyName: "type", dataType: "string"}]
                },

                ageInYears: 0,

                averageWeeklyWorkingHours: 0,

                validation: [{ propertyName: "ageInYears", dataType: "positiveWholeNumber" },
                      { propertyName: "averageWeeklyWorkingHours", dataType: "positivenumber" }
        ],

                income: {
                    salary: 0,
                    selfEmployment: 0,
                    netDividends: 0,
                    netInterest: 0,
                    rental: 0,
                    nonStatePension: 0,
                    validation: [{ propertyName: "salary", dataType: "positivenumber" },
                         { propertyName: "selfEmployment", dataType: "positivenumber" },
                         { propertyName: "netDividends", dataType: "positivenumber" },
                         { propertyName: "rental", dataType: "positivenumber" },
                         { propertyName: "nonStatePension", dataType: "positivenumber" }
            ]
                },

                companyCars: [],

                companyVans: [{
                    privateUsePermitted: false,
                    fuelProvided: false
                }]
            }
        };
    };

    var getCompanyCarObject = function (listPrice, co2Emissions, isDiesel, isFuelProvided) {
        return {
            listPrice: listPrice,
            co2Emissions: co2Emissions,
            isDiesel: isDiesel,
            fuelProvided: isFuelProvided,
            validation: [{ propertyName: "listPrice", dataType: "positivenumber" },
                         { propertyName: "co2Emissions", dataType: "positivenumber" }
            ]
        };
    };

    var getGenderType = function () { return [{ name: "female", display: "Female" }, { name: "male", display: "Male"}]; };

    var getMaritalStatus = function () { return [{ name: "single", display: "Single" }, { name: "married", display: "Married" }, { name: "civilpartnership", display: "Civil Partnership" }, { name: "cohabiting", display: "Cohabiting" }, { name: "divorced", display: "Divorced"}]; };

    return {
        getVehicleFuelObject: getVehicleFuelObject,
        getCarObjectForVehicleDuty: getCarsObjectForVehicleDuty,
        getCompanyCarObject: getCompanyCarObject,
        getVehicleDutyTypes: getVehicleDutyTypes,
        getVehicleFuelTypes: getVehicleFuelTypes,

        getGenderType: getGenderType,
        getMaritalStatus: getMaritalStatus,
        getInputs: getInputs
    };
});
