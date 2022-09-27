import { priceFormatter, priceFormatterDecimals } from "./formatters.js";

// Инпуты
const inputCost = document.querySelector("#input-cost");
const inputDownPayment = document.querySelector("#input-downpayment");
const inputTerm = document.querySelector("#input-term");

const form = document.querySelector("#form");
const totalCost = document.querySelector("#total-cost");
const totalMonthPayment = document.querySelector("#total-month-payment");

// Cleave опции форматирования
const cleavePriceSettings = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  delimiter: " ",
};

// Запускаем форматирование cleave
const cleaveCost = new Cleave(inputCost, cleavePriceSettings);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSettings);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSettings);

//Сумма кредита
calcMortgage();

// Отображение и расчет суммы кредита
form.addEventListener("input", function () {
  //Сумма кредита
  calcMortgage();
});

function calcMortgage() {
  //Общая сумма кредита
  const totalAmount =
    +cleaveCost.getRawValue() - cleaveDownPayment.getRawValue();
  totalCost.innerText = priceFormatter.format(totalAmount);

  //Ставка по кредиту
  const creditRate = +document.querySelector('input[name="programm"]:checked')
    .value;
  const monthRate = (creditRate * 100) / 12;

  //Срок ипотеки
  const years = +cleaveTerm.getRawValue();
  const months = years * 12;

  //Расчет ежемесячного платежа
  const monthPayment =
    (totalAmount * monthRate) / (1 - (1 + monthRate) * (1 - months));

  //Отображение ежемесячного платежа
  totalMonthPayment.innerText = priceFormatterDecimals.format(monthPayment);
}

//Slider Cost
const sliderCost = document.getElementById("slider-cost");

noUiSlider.create(sliderCost, {
  start: 12000000,
  connect: "lower",
  tooltips: true,
  step: 100000,
  range: {
    min: 0,

    "50%": [10000000, 1000000],

    max: 100000000,
  },

  format: wNumb({
    decimals: 0,
    thousand: " ",
    suffix: "",
  }),
});

sliderCost.noUiSlider.on("update", function () {
  const sliderValue = parseInt(sliderCost.noUiSlider.get(true));
  inputCost.value = sliderValue;

  cleaveCost.setRawValue(sliderValue);
  calcMortgage();
});

//Slider DownPayment
const sliderDownPayment = document.getElementById("slider-downpayment");

noUiSlider.create(sliderDownPayment, {
  start: 6000000,
  connect: "lower",
  tooltips: true,
  step: 100000,
  range: {
    min: 0,

    "50%": [10000000, 1000000],

    max: 100000000,
  },

  format: wNumb({
    decimals: 0,
    thousand: " ",
    suffix: "",
  }),
});

sliderDownPayment.noUiSlider.on("update", function () {
  const sliderValue = parseInt(sliderDownPayment.noUiSlider.get(true));
  cleaveDownPayment.setRawValue(sliderValue);
  calcMortgage();
});

//Slider Years
const sliderTerm = document.getElementById("slider-term");

noUiSlider.create(sliderTerm, {
  start: 1,
  connect: "lower",
  tooltips: true,
  step: 1,
  range: {
    min: 1,
    max: 30,
  },

  format: wNumb({
    decimals: 0,
    thousand: "",
    suffix: "",
  }),
});

sliderTerm.noUiSlider.on("update", function () {
  const sliderValue = parseInt(sliderTerm.noUiSlider.get(true));
  cleaveTerm.setRawValue(sliderValue);
  calcMortgage();
});
