// пример для реализации алгоритма
const obj = {
  someNull: null,
  someUndefined: undefined,
  name: "John",
  arr: [1, 2, 3, 4, { a: 3, b: 4, arrt: [{ t: 3 }, 1, 23, 4] }, 5, 6],
  ot: {
    u: 2,
    y: 3,
  },
  returnSomeNumber: function () {
    return 42;
  },
  data: new Date(),
};
// конец примера
//--------------------------------------------------------------------------

// функция клолнирования
function superDeep(obj) {
  const clone = {};
  //здесь важно понимать, с чем мы все таки работаем и писать условия исходя из получаемых данных, уверен, будут вопросы по new Date() )))
  if (obj instanceof Date) {
    return new Date(obj);
  } else if (obj === null || (!Array.isArray(obj) && typeof obj !== "object")) {
    return obj;
  }
  if (Array.isArray(obj) == true) {
    return obj.map((i) => superDeep(i));
  } else if (typeof obj == "object") {
    Object.keys(obj).forEach((i) => (clone[i] = superDeep(obj[i])));
  }
  return clone;
}
// функция клолнирования --------------------------------------------------------------------
//экземпляр
const clone = superDeep(obj);
//экземпляр -------------------------------------------

// функция проверки копирования
function toEqw(natural, clone, storage = []) {
  const arrayu = storage;
  if (natural !== clone) {
    // работа исключительно с данными ссылочного типа. непримитивы сравниваются по ссылочному значению, поэтому,
    // если они повторяют друг друга, то они равны, если же они скопированы, то они не будут равны и запушатся в массив с соотв записью)
    if (Array.isArray(clone)) {
      arrayu.push(
        `${JSON.stringify(natural)} не равно ${JSON.stringify(clone)}`
      );
    } else if (typeof clone === "object" && !(clone instanceof Date)) {
      arrayu.push(
        `${JSON.stringify(natural)} не равно ${JSON.stringify(clone)}`
      );
    }
    if (clone instanceof Date) {
      arrayu.push(`${natural} не равно ${clone} `);
    }
    // ФУНКЦИИ: если сравнивать просто 2 объекта, то функции совершенно различны
    if (typeof clone === "function") {
      arrayu.push(`${clone} не равно ${clone}`);
    }
    // примитивы сравниваются по значению, а это означает, что они в любом случае будут равны.
  } else {
    // ФУНКЦИИ: если сравнивать obj и итог функции глубокого копирования, то они будут равны (причуда js?)
    if (typeof clone === "function") {
      arrayu.push(`${clone} не равно ${clone}`);
    } else {
      arrayu.push(`${natural} не равно ${clone}`);
    }
  }

  if (Array.isArray(natural) && Array.isArray(clone)) {
    return natural.map((item, index) => {
      toEqw(item, clone[index], arrayu);
    });
  } else if (typeof natural == "object" && typeof clone == "object") {
    for (const key in natural) {
      toEqw(natural[key], clone[key], arrayu);
    }
  }

  return arrayu;
}
// функция проверки копирования --------------------------------------------------

const obj2 = {
  someNull: null,
  someUndefined: undefined,
  name: "John",
  arr: [1, 2, 3, 4, { a: 3, b: 4, arrt: [{ t: 3 }, 1, 23, 4] }, 5, 6],
  ot: {
    u: 2,
    y: 3,
  },
  returnSomeNumber: function () {
    return 42;
  },
  data: new Date(),
};

obj.logi = function logi() {
  console.log("sasaycudassay");
};

console.log(toEqw(obj, clone));
console.log(clone, obj);
console.log(toEqw(obj, obj2));
