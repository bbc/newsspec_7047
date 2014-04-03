/* jshint -W100 */
/*
* ^^^ hide the error "This character may get silently deleted by one or more browsers."
* (this is thrown when we have a £ in a comment)
*
*
* Asynchronous Module Definition containing all methods related to Display
* display result overview, display full results in table, populate options in select field element
*/

define(['bootstrap'], function (news) {
	var isDesktop = false,
		DISPLAY_PENCE = true,
		DONT_DISPLAY_PENCE = false,
		BEGIN_MSG = 'In 2014-15 you will be ',
		WORSE_OFF_MSG = 'worse off by about ',
		BETTER_OFF_MSG = 'better off by about ',
		MONEY_DISPLAY = DONT_DISPLAY_PENCE;

	var init = function () {
		news.pubsub.on('ns__budget__calculator:viewport:desktop', function (desktop) {
			isDesktop = desktop;
			updateVocabulary(isDesktop);
		});
	};
	
	var updateVocabulary = function (desktop) {
		if (desktop) {
			MONEY_DISPLAY = DISPLAY_PENCE;
			BEGIN_MSG = 'In 2014-15 you will be ';
		} else {
			MONEY_DISPLAY = DISPLAY_PENCE; //DONT_DISPLAY_PENCE;
			BEGIN_MSG = 'You will be ';
		}
	};
	
	// display the result overview, wording and colour of result is different depending on whether you are better or worse off.
	var displayResult = function (resultVO) {

		var overviewBegin = news.$('.budget_calculator__result_overview-begin'),
			overviewAmount = news.$('.budget_calculator__result_overview-amount'),
			overviewEnd = news.$('.budget_calculator__result_overview-end');

		var isPenceDisplayed = DISPLAY_PENCE,
			total = resultVO.difference.total,
			moneyStr,
			resultNode;

		// hide pence if displaying 100 or more
		if (Math.abs(total) >= 100) {
			isPenceDisplayed = DONT_DISPLAY_PENCE;
		}
		
		moneyStr = formatCurrency(Math.abs(total), '&pound;', isPenceDisplayed);

		overviewAmount.html(moneyStr);

		if (total < 0) {
			overviewAmount.addClass('debt');
			overviewBegin.html(BEGIN_MSG);
			overviewEnd.html(WORSE_OFF_MSG);
		} else {
			overviewAmount.removeClass('debt');
			overviewBegin.html(BEGIN_MSG);
			overviewEnd.html(BETTER_OFF_MSG);
		}
	};

	// build options drop-down in the select list with id=selectID
	// pass ID of select box and an object containing a validtypes property that contains the list of options
	var buildOptionsHTML = function (selectID, optionsArray) {
		document.getElementById(selectID).innerHTML = '';
		var optionsCount = optionsArray.length;
		if (optionsCount > 0) {
			for (var i = 0; i < optionsCount; i++) {
				news.$('#' + selectID).append('<option value="' + optionsArray[i].name + '">' + optionsArray[i].display + '</option>');
			}
		}
	};

	// add options to all the form select fields
	var buildSelectOptions = function (inputsGenerator) {
		var fuelTypes = inputsGenerator.getVehicleFuelTypes(),
			vehicleDutyTypes = inputsGenerator.getVehicleDutyTypes(),
			gendertypes = inputsGenerator.getGenderType(),
			statusTypes = inputsGenerator.getMaritalStatus();
		// pass ID of select box and an object containig a validtypes property that contains the list of options
		buildOptionsHTML('yourgender', gendertypes);
		buildOptionsHTML('status', statusTypes);
		buildOptionsHTML('partnergender', gendertypes);
		buildOptionsHTML('car1emission', vehicleDutyTypes);
		buildOptionsHTML('fuelType', fuelTypes);
		buildOptionsHTML('car2emission', vehicleDutyTypes);
		buildOptionsHTML('fuelType2', fuelTypes);
	};
	
	var formatCurrency = function (n_value, symbol, isPenceDisplayed, show_symbol_afterwards) {
		// If a negative amount then display -£100 instead of £-100
		if (n_value < 0) {
			symbol = '-' + symbol;
			n_value = Math.abs(n_value);
		}
		
		// round down to nearest pound by removing decimal points
		var valInteger = Math.floor(n_value);
		var currencyString = valInteger.toString();
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(currencyString)) {
			currencyString = currencyString.replace(rgx, '$1' + ',' + '$2');
		}

		var moneyStr = symbol + currencyString;
		show_symbol_afterwards = show_symbol_afterwards || false;
		if (show_symbol_afterwards) {
			moneyStr = currencyString + symbol;
		}
		
		// to get pence
		if (isPenceDisplayed) {
			var totalPence = n_value - valInteger;
			var pence = Math.floor(100 * totalPence);
			if (pence < 10) {
				pence = '0' + pence;
			}
			moneyStr = moneyStr + '.' + pence;
		}

		return moneyStr;
	};

	// display the money in the specified table cell
	var showMeTheMoney = function (id, money) {
		var moneyDisplay = formatCurrency(money, '&pound;', MONEY_DISPLAY);
		news.$(id).html(moneyDisplay);
	};
	
	// the total for the year is not be provided by KPMG so this method provides that result
	function getTotalForYear(yearObj) {
		var total_out = yearObj.duty.alcohol + yearObj.duty.tobacco + yearObj.duty.fuel + yearObj.duty.vehicleDuty + yearObj.overall.tax + yearObj.overall.NI;
		var total_in = yearObj.childBenefits + yearObj.taxCredit + yearObj.overall.statePension;
		var total = total_in - total_out;
		return total;
	}
		
	// table data cells have the following IDs
	// column 1: res_{type}_thisyear
	// column 2: res_{type}_nextyear
	// column 3: res_{type}_difference
	// these are the types: alchohol, cigarettes, incometax, ni, childbenefits, taxcredits, pension, vehicleduty, fuel, total
	/*example table cells
		<td id='res_alchohol_thisyear'>&pound;349</td>
		<td id='res_alchohol_nextyear'>&pound;449</td>
		<td id='res_alchohol_difference'>&pound;100</td>
	*/
	// put all the budget results in to the table cells
	var changeTableValues = function (resultsVO) {
		var THISYEAR = resultsVO.resultsThisYear,
			NEXTYEAR = resultsVO.resultsNextYear,
			DIF = resultsVO.difference;

		// alchohol values
		showMeTheMoney('#res_alcohol_thisyear', THISYEAR.duty.alcohol);
		showMeTheMoney('#res_alcohol_nextyear', NEXTYEAR.duty.alcohol);
		showMeTheMoney('#res_alcohol_difference', DIF.duty.alcohol);
		// tobacco values
		showMeTheMoney('#res_cigarettes_thisyear', THISYEAR.duty.tobacco);
		showMeTheMoney('#res_cigarettes_nextyear', NEXTYEAR.duty.tobacco);
		showMeTheMoney('#res_cigarettes_difference', DIF.duty.tobacco);
		// fuel values
		showMeTheMoney('#res_fuel_thisyear', THISYEAR.duty.fuel);
		showMeTheMoney('#res_fuel_nextyear', NEXTYEAR.duty.fuel);
		showMeTheMoney('#res_fuel_difference', DIF.duty.fuel);
		// vehicle duty values
		showMeTheMoney('#res_vehicleduty_thisyear', THISYEAR.duty.vehicleDuty);
		showMeTheMoney('#res_vehicleduty_nextyear', NEXTYEAR.duty.vehicleDuty);
		showMeTheMoney('#res_vehicleduty_difference', DIF.duty.vehicleDuty);
		// income tax
		showMeTheMoney('#res_incometax_thisyear', THISYEAR.overall.tax);
		showMeTheMoney('#res_incometax_nextyear', NEXTYEAR.overall.tax);
		showMeTheMoney('#res_incometax_difference', DIF.overall.tax);
		// nationalInsurance
		showMeTheMoney('#res_ni_thisyear', THISYEAR.overall.NI);
		showMeTheMoney('#res_ni_nextyear', NEXTYEAR.overall.NI);
		showMeTheMoney('#res_ni_difference', DIF.overall.NI);
		// child Benefits
		showMeTheMoney('#res_childbenefits_thisyear', THISYEAR.childBenefits);
		showMeTheMoney('#res_childbenefits_nextyear', NEXTYEAR.childBenefits);
		showMeTheMoney('#res_childbenefits_difference', DIF.childBenefits);
		// tax credits
		showMeTheMoney('#res_taxcredits_thisyear', THISYEAR.taxCredit);
		showMeTheMoney('#res_taxcredits_nextyear', NEXTYEAR.taxCredit);
		showMeTheMoney('#res_taxcredits_difference', DIF.taxCredit);
		// state pension
		showMeTheMoney('#res_pension_thisyear', THISYEAR.overall.statePension);
		showMeTheMoney('#res_pension_nextyear', NEXTYEAR.overall.statePension);
		showMeTheMoney('#res_pension_difference', DIF.overall.statePension);
		// state pension
		//showMeTheMoney('#res_total_thisyear', THISYEAR.total);
		//showMeTheMoney('#res_total_nextyear', NEXTYEAR.total);
		showMeTheMoney('#res_total_thisyear', getTotalForYear(THISYEAR));
		showMeTheMoney('#res_total_nextyear', getTotalForYear(NEXTYEAR));
		showMeTheMoney('#res_total_difference', DIF.total);
	};
	
	// add share button to share how budget affects you
	// e.g. I will be about XXXX better off in 2012/13 #bbcbudgetcalculator How will the budget affect you? http://bbc.in/GIIZAe
	// e.g. I will be about XXXX worse off in 2012/13 #bbcbudgetcalculator How will the budget affect you? http://bbc.in/GIIZAe
	var personalisedSharing = function (resultVO) {
		var total = resultVO.difference.total,
			moneyStr = formatCurrency(Math.abs(total), ' pounds', DONT_DISPLAY_PENCE, true),
			displayStr = '';

		displayStr += 'I will be about ' + moneyStr + ' ';
		displayStr += (total < 0) ? 'worse off' : 'better off';
		displayStr += '. How will the Budget affect you?';
		news.pubsub.emit('ns:share:message', [displayStr]);
	};
	
	init();

	// ------ public API  ---------------
	return {
		displayResult: displayResult,
		changeTableValues: changeTableValues,
		buildSelectOptions: buildSelectOptions,
		personalisedSharing: personalisedSharing
	};
});