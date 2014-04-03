define([], function () {

    var convert = function (item, constants) {

        var price = 1;
        if (constants["price_" + item.type] != undefined) {
            price = parseFloat(constants["price_" + item.type].rate);
        }
        var convertor = convertors[item.dutyGroup];
        return convertor != undefined ? convertor(item, price) : noConversion(item);
    };

    var noConversion = function (item) {
        return item.quantity;
    };


    var convertFuel = function (item, price) {

        return item.quantity / price;
    };

    var convertors = new Array();

    convertors["fuel"] = convertFuel;

    return {
        Convert: convert
    };
});
