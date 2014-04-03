/**
	Asynchronous Module Definition for building a form object to send to KPMG budget calculator
*/
define(['inputsgenerator'], function (inputsGenerator) {

	var getNumber = function (id) {
		var num = 0;
		if (id) {
			num = Number(id.value);
			if (isNaN(num) || num < 0) {
				num = 0;
			}
		}
		return num;
	};
	
	var getOption = function (id) {
		var option = '';
		if (id) {
			option = id.value;
		}
		return option;
	};
	
	var getChecked = function (id) {
		var checked = 0;
		if (id) {
			checked = id.checked;
		}
		return checked;
	};
	
	// put all the values from the form fields in to the object in the Inputs module. This object is passed to the KPMG calculator
	var updateInputsWithFormFields = function (thisForm, Inputs, tempIncludePartner, tempIncludeCompanyCar) {
		// boolean value for including or excluding partner's details in tax calculations
		Inputs.includePartner = tempIncludePartner;

		// page 1 inputs - Alchohol and Tobacco
		Inputs.weeklyConsumption.beer.quantity = getNumber(thisForm.beer);
		Inputs.weeklyConsumption.wine.quantity = getNumber(thisForm.wine);
		Inputs.weeklyConsumption.spirits.quantity = getNumber(thisForm.spirits);
		Inputs.weeklyConsumption.cigarettes.quantity = getNumber(thisForm.cigarettes);
		
		// page 2 inputs - About you and your partner details
		Inputs.person.maritalStatus.type = getOption(thisForm.status);
		Inputs.person.children = getNumber(thisForm.children);
		Inputs.person.ageInYears = getNumber(thisForm.yourage);
		Inputs.person.gender.type = getOption(thisForm.yourgender);
		Inputs.person.averageWeeklyWorkingHours = getNumber(thisForm.yourhoursworked);
		Inputs.spouse.ageInYears = getNumber(thisForm.partnerage);
		Inputs.spouse.gender.type = getOption(thisForm.partnergender);
		Inputs.spouse.averageWeeklyWorkingHours = getNumber(thisForm.partnerhoursworked);
		
		// page 3 inputs - Income for you and spouse
		Inputs.person.income.salary = getNumber(thisForm.yoursalary);
		Inputs.person.income.selfEmployment = getNumber(thisForm.yourselfemployment);
		Inputs.person.income.netDividends = getNumber(thisForm.yourdividends);
		Inputs.person.income.netInterest = getNumber(thisForm.yourinterest);
		Inputs.person.income.rental = getNumber(thisForm.yourrental);
		Inputs.person.income.nonStatePension = getNumber(thisForm.yourpension);
		Inputs.spouse.income.salary = getNumber(thisForm.partnersalary);
		Inputs.spouse.income.selfEmployment = getNumber(thisForm.partnerselfemployment);
		Inputs.spouse.income.netDividends = getNumber(thisForm.partnerdividends);
		Inputs.spouse.income.netInterest = getNumber(thisForm.partnerinterest);
		Inputs.spouse.income.rental = getNumber(thisForm.partnerrental);
		Inputs.spouse.income.nonStatePension = getNumber(thisForm.partnerpension);
		
		// page 4 inputs - Vehicles - you and your spouse, private cars, company cars and company vans
		// private cars
		Inputs.weeklyConsumption.cars = [];
		Inputs.weeklyConsumption.cars[0] = inputsGenerator.getCarObjectForVehicleDuty(getOption(thisForm.car1emission));
		Inputs.weeklyConsumption.vehicleFuel[0] = inputsGenerator.getVehicleFuelObject(getNumber(thisForm.fuel), getOption(thisForm.fuelType));
		
		// for our interface we are tying car 2 with spouse so if not to include partner then pass 0 and null for car 2 - 
		if (tempIncludePartner) {
			Inputs.weeklyConsumption.cars[1] = inputsGenerator.getCarObjectForVehicleDuty(getOption(thisForm.car2emission));
			Inputs.weeklyConsumption.vehicleFuel[1] = inputsGenerator.getVehicleFuelObject(getNumber(thisForm.fuel2), getOption(thisForm.fuelType2));
		} else {
			// TODO: get KPMG to handle "" instead of "nocar"
			Inputs.weeklyConsumption.cars[1] = inputsGenerator.getCarObjectForVehicleDuty('nocar');
			Inputs.weeklyConsumption.vehicleFuel[1] = inputsGenerator.getVehicleFuelObject(0, 'unleaded');
		}
		
		// company cars
		// the boolean from the checkbox to include company car is not passed to the KPMG calculator
		// if it's false then return 0 for number fields, false for checkboxes
		// if false then values will not be included in calculations but the disabled fields retain their values
		if (tempIncludeCompanyCar) {
			var listPrice = getNumber(thisForm.companycar_listprice);
			var emissions = getNumber(thisForm.companycar_emissions);
			var isDiesel = getChecked(thisForm.companycar_diesel);
			var isFuelProvided = getChecked(thisForm.companycar_fuelprovided);
			Inputs.person.companyCars[0] = inputsGenerator.getCompanyCarObject(listPrice, emissions, isDiesel, isFuelProvided);

			Inputs.person.companyVans[0].privateUsePermitted = getChecked(thisForm.companyvan_privateuse);
			Inputs.person.companyVans[0].fuelProvided = getChecked(thisForm.companyvan_fuelprovided);

			var listPrice2 = getNumber(thisForm.partner_companycar_listprice);
			var emissions2 = getNumber(thisForm.partner_companycar_emissions);
			var isDiesel2 = getChecked(thisForm.partner_companycar_diesel);
			var isFuelProvided2 = getChecked(thisForm.partner_companycar_fuelprovided);
			Inputs.spouse.companyCars[0] = inputsGenerator.getCompanyCarObject(listPrice2, emissions2, isDiesel2, isFuelProvided2);
			
			Inputs.spouse.companyVans[0].privateUsePermitted = getChecked(thisForm.partner_companyvan_privateuse);
			Inputs.spouse.companyVans[0].fuelProvided = getChecked(thisForm.partner_companyvan_fuelprovided);
		} else {
			Inputs.person.companyCars[0] = inputsGenerator.getCompanyCarObject(0, 0, false, false);
			Inputs.person.companyVans[0].privateUsePermitted = false;
			Inputs.person.companyVans[0].fuelProvided = false;

			Inputs.spouse.companyCars[0] = inputsGenerator.getCompanyCarObject(0, 0, false, false);
			Inputs.spouse.companyVans[0].privateUsePermitted = false;
			Inputs.spouse.companyVans[0].fuelProvided = false;
		}

		return Inputs;
	};
	
	return {
		updateInputsWithFormFields: updateInputsWithFormFields
	};
});