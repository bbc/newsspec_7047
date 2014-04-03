define(['bootstrap', 'kpmgmodule', 'display', 'inputsgenerator', 'updateInputs', 'validate', 'form_navigation', 'form_popup', 'form_input_disabler'], function (news, KPMGCalc, Display, inputsGenerator, InputUpdater, validate, form_navigation, form_popup, form_input_disabler) {

	var isMobile,
		Inputs = {};

	var init = function () {
		form_input_disabler.init();
		form_popup.init();
		setUpKpmgModules();
		addEventListeners();
		form_navigation.init();
	};

	var setUpKpmgModules = function () {
		Inputs = inputsGenerator.getInputs();
		prefillForm(getUrlParams());
		Display.buildSelectOptions(inputsGenerator);
		updateResults();
	};

	var addEventListeners = function () {
		listenForInputUpdates();
		listenForNavigation();
		listenForResize();
	};

	var listenForInputUpdates = function () {
		news.pubsub.on('ns__budget__calculator:results:updated', updateResults);

		news.$('select, input, checkbox').on('change', function () {
			news.pubsub.emit('ns__budget__calculator:results:updated');
		});

		// fire event as soon as a key stroke is deteted
		document.onkeyup = function () {
			news.pubsub.emit('ns__budget__calculator:results:updated');
		};
	};

	var listenForNavigation = function () {
		news.pubsub.on('ns__budget__calculator:navigation', function (navSection, currentSection) {
			if (navSection > 0 && navSection <= 5) {
				var validated = validate.form(currentSection, form_input_disabler.FORM_ID());

				if (validated) {
					news.pubsub.emit('ns__budget__calculator:navigation:updated', [navSection]);
					news.$('.ns__budget__calculator-page').hide();

					if (navSection < 5) {
						showPage(navSection);
					} else {
						showDetailedResults();
					}
				} else {
					news.pubsub.emit('ns__budget__calculator:error');
				}
			}
		});
	};

	var listenForResize = function () {
		news.$(window).on('resize', renderMobileDesktopView);
		renderMobileDesktopView();
	};

	var renderMobileDesktopView = function () {
		var oldState = isMobile;
		isMobile = window.innerWidth < 624;

		if (isMobile !== oldState) {
			news.pubsub.emit('ns__budget__calculator:viewport:desktop', [!isMobile]);
		}
	};
	
	var updateResults = function () {
		Inputs = InputUpdater.updateInputsWithFormFields(form_input_disabler.FORM_ID(), Inputs, form_input_disabler.includePartner(), form_input_disabler.includeCompanyCar());
		var resultVO = KPMGCalc.calculateResults(Inputs);
		Display.displayResult(resultVO);
	};

	var showPage = function (page) {
		news.$('.ns__budget__calculator-page--' + page).show();
	};

	var showDetailedResults = function () {
		var resultVO = KPMGCalc.calculateResults(Inputs);
		Display.changeTableValues(resultVO);
		Display.personalisedSharing(resultVO);
		news.$('.ns__budget__calculator-page--5').show();
	};
	
	var prefillForm = function (urlParams) {
		news.$('#beer').val(validate.getRangedNumber(urlParams.b));
		news.$('#wine').val(validate.getRangedNumber(urlParams.w));
		news.$('#spirits').val(validate.getRangedNumber(urlParams.s));
		news.$('#cigarettes').val(validate.getRangedNumber(urlParams.c));
	};

	/**
	* Get query string, split on ?
	* Get each value, split on &
	* Loop through values, split on = to get name-value pair
	*/
	var getUrlParams = function () {
		var urlParams = {b: 0, w: 0, c: 0, s: 0},
			e,
			a = /\+/g,					// Regex for replacing addition symbol with a space
			r = /([^&=]+)=?([^&]*)/g,
			d = function (s) {
				return decodeURIComponent(s.replace(a, ' '));
			},
			q = window.location.hash.replace('#', '');

		while (e = r.exec(q)) {
			urlParams[d(e[1])] = d(e[2]);
		}

		return urlParams;
	};

	return {
		init: init
	};
});