// функуция для отображения блоков с заданиями при выборе определённого задания
function openTask(taskNumber) { 

    document.getElementById('task_1_block').style.display = 'none'; // убирает видимость блока 1
    document.getElementById('task_2_block').style.display = 'none'; // убирает видимость блока 2

    document.getElementById('tab_1').classList.remove('active'); // отключение подсветки кнопок
    document.getElementById('tab_2').classList.remove('active'); // отключение подсветки кнопок

    document.getElementById('task_' + taskNumber + '_block').style.display = 'block'; // в зависимости от выбранного задания, эта штука получает номер задания
    document.getElementById('tab_' + taskNumber).classList.add('active'); // и выводит выбранное задание на сайт
}

document.getElementById('field_p').addEventListener('input', function() { // для того, чтобы в поле ответов писалось выбранный размер поля
    document.getElementById('p-display').textContent = this.value || 'p';
});
                       //А зачем ты сюда полез??? Интересно стало????

function not_zero(list) { // функция для очистки нулей слева
    while (list.length > 1 && Math.abs(list.at(0)) < 1e-9) {
        list.shift();
    }
    if (list.length === 1 && Math.abs(list.at(0)) < 1e-9) {
        return new Array(1).fill(0);
    }
    return list;
}

// Вычитание многочленов
function poly_minus(f, g) {
    let max_len = Math.max(f.length, g.length);

    let new_f = new Array(max_len - f.length).fill(0).concat(f);
    let new_g = new Array(max_len - g.length).fill(0).concat(g);

    let result_poly_minus = [];
    for (let i = 0; i < max_len; i++) {
        let val = Number((new_f[i] - new_g[i]).toFixed(5));
        result_poly_minus.push(val === 0 ? 0 : val);
    }

    return not_zero(result_poly_minus);
}

// Умножение многочленов
function prod_poly(f, g) {
    let result_prod = new Array((f.length + g.length) - 1).fill(0);

    for (let i = 0; i < f.length; i++) {
        for (let j = 0; j < g.length; j++) {
            result_prod[i + j] += f[i] * g[j];
        }
    }

    return not_zero(result_prod.map(k => {
        let val = Number(k.toFixed(5));
        return val === 0 ? 0 : val;
    }));
}

// Деление с остатком: возвращает и остаток r, и частное q
function copy_func(f, g) {
    let r = not_zero([...f]);
    g = not_zero([...g]);
    let q = new Array(Math.max(1, r.length - g.length + 1)).fill(0);

    while (r.length >= g.length && !(r.length === 1 && r.at(0) === 0)) {
        let coef = r.at(0) / g.at(0);
        let position = q.length - 1 - (r.length - g.length);
        q[position] = Number(coef.toFixed(5));

        for (let j = 0; j < g.length; j++) {
            r[j] -= coef * g[j];
        }

        r = not_zero(r.map(x => Number(x.toFixed(5))));
    }

    return { r: r, q: not_zero(q) };
}

// Вычисление НОД и коэффициентов Безу
function nod(f, g) {
    f = not_zero([...f]);
    g = not_zero([...g]);

    let u_0 = Array.of(1);
    let u_1 = Array.of(0);
    let v_0 = Array.of(0);
    let v_1 = Array.of(1);

    while (!(g.length === 1 && g.at(0) === 0)) { // алгоритм Евклида
        let { r, q } = copy_func(f, g);
        f = g;
        g = r;

        let next_u = poly_minus(u_0, prod_poly(q, u_1));
        u_0 = u_1;
        u_1 = next_u;

        let next_v = poly_minus(v_0, prod_poly(q, v_1));
        v_0 = v_1;
        v_1 = next_v;
    }

    let norm = f.at(0); // нормирование нод
    if (norm !== 0) {
        f = f.map(y => Number((y / norm).toFixed(5)) || 0);
        u_0 = u_0.map(z => Number((z / norm).toFixed(5)) || 0);
        v_0 = v_0.map(t => Number((t / norm).toFixed(5)) || 0);
    }

    return { res_nod: f, u: u_0, v: v_0 };
}

// Вычисление НОК
function nok(f_x, g_x, f) {
    let res = new Array((f_x.length + g_x.length) - 1).fill(0);

    for (let i = 0; i < f_x.length; i++) {
        for (let j = 0; j < g_x.length; j++) {
            res[i + j] += f_x[i] * g_x[j];
        }
    }
    
    let res_copy = not_zero([...res]);
    let list_nok = new Array(Math.max(1, res_copy.length - f.length + 1)).fill(0);

    while (res_copy.length >= f.length && !(res_copy.length === 1 && res_copy.at(0) === 0)) {
        let coef = res_copy.at(0) / f.at(0);
        let position = list_nok.length - 1 - (res_copy.length - f.length);
        list_nok[position] = Number(coef.toFixed(5));

        for (let k = 0; k < f.length; k++) {
            res_copy[k] -= coef * f[k];
        }

        res_copy = not_zero(res_copy.map(x => Number(x.toFixed(5))));
    }

    let norm = list_nok.at(0);
    if (norm < 0) {
        list_nok = list_nok.map(y => y * (-1) || 0);
    }

    return not_zero(list_nok);
}

// Красивое математическое отображение многочлена
function formatPoly(coeffs) {
    let clean = not_zero([...coeffs]);
    if (clean.length === 1 && clean.at(0) === 0) {
        return "0";
    }

    let degree = clean.length - 1;
    let parts = [];

    for (let i = 0; i < clean.length; i++) {
        let coef = clean[i];
        let power = degree - i;

        if (coef === 0) continue;

        let isNegative = coef < 0;
        let absCoef = Math.abs(coef);

        let sign = "";
        if (parts.length === 0) {
            sign = isNegative ? "-" : "";
        } else {
            sign = isNegative ? " - " : " + ";
        }

        let coefStr = "";
        if (absCoef !== 1 || power === 0) {
            coefStr = absCoef.toString();
        }

        let varStr = "";
        if (power === 1) {
            varStr = "x";
        } else if (power > 1) {
            varStr = `x<sup>${power}</sup>`;
        }

        parts.push(`${sign}${coefStr}${varStr}`);
    }

    return parts.join("");
}

// Связь с HTML
document.getElementById("button_1").addEventListener("click", function () {
    let f_x = Array.from(document.querySelectorAll("#f1_inputs input")).map(el => Number(el.value) || 0);
    let g_x = Array.from(document.querySelectorAll("#g1_inputs input")).map(el => Number(el.value) || 0);

    if (f_x.every(x => x === 0) || g_x.every(x => x === 0)) {
        return; // защита от пустого ввода
    }

    let { res_nod, u, v } = nod(not_zero([...f_x]), g_x);
    let res_nok = nok(f_x, g_x, res_nod);

    document.querySelector("#task_1_block #gcd_res").innerHTML = formatPoly(res_nod);
    document.querySelector("#task_1_block #lcm_res").innerHTML = formatPoly(res_nok);
    document.querySelector("#task_1_block #u_res").innerHTML = formatPoly(u);
    document.querySelector("#task_1_block #v_res").innerHTML = formatPoly(v);
});

// ЗАДАНИЕ 2

// Корректный остаток от деления в JS (для отрицательных чисел, как % в Python)
function pyMod(n, p) {
    return ((n % p) + p) % p;
}

// Очистка нулей слева и приведение коэффициентов по модулю p
function not_zero_mod(list, p) {
    let list_2 = list.map(i => pyMod(i, p));
    while (list_2.length > 1 && list_2.at(0) === 0) {
        list_2.shift();
    }
    return list_2;
}

// Функция, проверяющая, является ли число p простым
function is_pioly(p) {
    if (!Number.isInteger(p) || p < 2) {
        return false;
    }
    for (let i = 2; i < p; i++) {
        if (p % i === 0) {
            return false;
        }
    }
    return true;
}

// Функция для нахождения обратного элемента
function invers(a, p) {
    a = pyMod(a, p);
    for (let i = 1; i < p; i++) {
        if (pyMod(a * i, p) === 1) {
            return i;
        }
    }
    return null;
}

// Вычитание коэффициентов многочленов в Z_p
function poly_minus_mod(f, g, p) {
    let max_len = Math.max(f.length, g.length);

    let new_f = new Array(max_len - f.length).fill(0).concat(f);
    let new_g = new Array(max_len - g.length).fill(0).concat(g);

    let result_poly_minus = Array.of();
    for (let i = 0; i < max_len; i++) {
        result_poly_minus.push(pyMod(new_f.at(i) - new_g.at(i), p));
    }

    return not_zero_mod(result_poly_minus, p);
}

// Умножение многочленов в Z_p
function prod_poly_mod(f, g, p) {
    let result_prod = new Array((f.length + g.length) - 1).fill(0);

    for (let i = 0; i < f.length; i++) {
        for (let j = 0; j < g.length; j++) {
            result_prod[i + j] = pyMod(result_prod.at(i + j) + f.at(i) * g.at(j), p);
        }
    }

    return not_zero_mod(result_prod, p);
}

// Деление с остатком в Z_p (возвращает остаток r и частное q)
function copy_func_mod(f, g, p) {
    let r = not_zero_mod([...f], p);
    g = not_zero_mod([...g], p);
    let q = new Array(Math.max(1, r.length - g.length + 1)).fill(0);

    let inv_g = invers(g.at(0), p); // обратный элемент к старшему коэф.

    while (r.length >= g.length && !(r.length === 1 && r.at(0) === 0)) {
        let coef = pyMod(r.at(0) * inv_g, p);
        let position = q.length - 1 - (r.length - g.length);
        q[position] = coef;

        for (let j = 0; j < g.length; j++) {
            r[j] = pyMod(r.at(j) - coef * g.at(j), p);
        }

        r = not_zero_mod(r, p);
    }

    return { r: r, q: not_zero_mod(q, p) };
}

// Главная часть вычисления НОД и коэффициентов Безу в Z_p
function nod_mod(f, g, p) {
    f = not_zero_mod([...f], p);
    g = not_zero_mod([...g], p);

    let u_0 = Array.of(1);
    let u_1 = Array.of(0);
    let v_0 = Array.of(0);
    let v_1 = Array.of(1);

    while (!(g.length === 1 && g.at(0) === 0)) {
        let { r, q } = copy_func_mod(f, g, p);
        f = g;
        g = r;

        let next_u = poly_minus_mod(u_0, prod_poly_mod(q, u_1, p), p);
        u_0 = u_1;
        u_1 = next_u;

        let next_v = poly_minus_mod(v_0, prod_poly_mod(q, v_1, p), p);
        v_0 = v_1;
        v_1 = next_v;
    }

    let norm = f.at(0); // нормирование НОД
    if (norm !== 0) {
        let invers_mod = invers(norm, p);
        f = f.map(i => pyMod(i * invers_mod, p));
        u_0 = u_0.map(z => pyMod(z * invers_mod, p));
        v_0 = v_0.map(t => pyMod(t * invers_mod, p));
    }

    return { res_nod: f, u: u_0, v: v_0 };
}

// Связь с HTML для Задания 2
document.getElementById("button_2").addEventListener("click", function () {
    let pole = Number(document.getElementById("field_p").value);
    let f_x = Array.from(document.querySelectorAll("#f2_inputs input")).map(el => Number(el.value) || 0);
    let g_x = Array.from(document.querySelectorAll("#g2_inputs input")).map(el => Number(el.value) || 0);

    if (!is_pioly(pole)) {
        alert("Модуль поля p должен быть простым числом!");
        return;
    }

    if (f_x.every(x => x === 0) || g_x.every(x => x === 0)) {
        return; // защита от пустого ввода
    }

    let { res_nod, u, v } = nod_mod(not_zero_mod([...f_x], pole), g_x, pole);

    document.querySelector("#task_2_block #gcd_2_res").innerHTML = formatPoly(res_nod);
    document.querySelector("#task_2_block #u_2_res").innerHTML = formatPoly(u);
    document.querySelector("#task_2_block #v_2_res").innerHTML = formatPoly(v);
});


