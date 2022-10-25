const sampleInput = [{
  key: "eligibility",
  value: "{{data.adult}} > 20",
},
{
  key: "adult",
  value: "{{data.age}} + 10",
},
{
  key: "age",
  value: 17,
},
];
const hashMap = {};
const getInstanceValue = (expression) => {
const fieldKeys = expression.split(".");
const res = fieldKeys.reduce(
  (acc, current) => {
      if (hashMap[current]) {
          return hashMap[current];
      } else {
          if (Array.isArray(acc)) {
              return calculateValue(acc.find((item) => item.key === current));
          }
      }
      return acc[current];
  }, {
      data: sampleInput
  }
);
return res;
};

const compute = (operantLeft, operantRight, operator) => {
switch (operator) {
  case "+":
      return Number(operantLeft) + Number(operantRight);
  case ">":
      return operantLeft > operantRight;  
  default:
      return "";
}
};

const calculateValue = (input) => {
const {
  key,
  value
} = input;
const instanceFieldRegex = /\B{{[A-Za-z.]+}}/g;
const operatorRegex = /[\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\)]+/;
const explicitValueRegex = /^[0-9]+/;
let result = "";

if (hashMap[key]) {
  return hashMap[key];
} else if (explicitValueRegex.test(value)) {
  hashMap[key] = value;
  return value;
}

const operator = value.match(operatorRegex)[0];

const operants = value.replace(/ /g, "").split(operator);

let [operantLeft, operantRight] = operants;

if (instanceFieldRegex.test(operantLeft)) {
  operantLeft = getInstanceValue(operantLeft.slice(2, -2));
}

if (instanceFieldRegex.test(operantRight)) {
  operantRight = getInstanceValue(operantRight.slice(2, -2));
}

result = compute(operantLeft, operantRight, operator);

hashMap[key] = result;

return result;
};

const calculate = (inputArray) =>
inputArray.map((item) => ({
  ...item,
  value: calculateValue(item),
}));

console.log(calculate(sampleInput));