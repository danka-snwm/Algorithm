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

function not_zero(list) { // функция для очистки нулей слева
    while (list.length > 1 && list[0] === 0) {
        list.shift();
    }
    return list;
}

function copy_func(f, g) {
    let r = not_zero([...f]);
    g = not_zero([...g]);

    while (r.length >= g.length && !(r.length === 1 && r[0] === 0)) {
        let coef = r[0] / g[0];

        for (let j = 0; j < g.length; j++) {
            r[j] -= coef * g[j];
        }

        r = not_zero(r.map(x => Number(x.toFixed(5))));
    }

    return r;
}

function nod(f, g) { // главная часть вычисления нод
    f = not_zero([...f]);
    g = not_zero([...g]);

    while (!(g.length === 1 && g[0] === 0)) { // алгоритм Евклида
        let r = copy_func(f, g);
        f = g;
        g = r;
    }

    let norm = f[0]; // нормирование нод
    if (norm !== 0) {
        f = f.map(y => Number((y / norm).toFixed(5)));
    }

    return f;
}

function nok(f_x, g_x, f) { // функция вычисления НОК
    let res = new Array((f_x.length + g_x.length) - 1).fill(0); // нахождение длины многочлена, который получится при умножении

    for (let i = 0; i < f_x.length; i++) { // цикл умножения многочленов
        for (let j = 0; j < g_x.length; j++) {
            res[i + j] += f_x[i] * g_x[j];
        }
    }

    let list_nok = [];
    let res_copy = not_zero([...res]);

    while (res_copy.length >= f.length && !(res_copy.length === 1 && res_copy[0] === 0)) { // деление f*x на нод(f, g)
        let coef = res_copy[0] / f[0];
        list_nok.push(Number(coef.toFixed(5)));

        for (let k = 0; k < f.length; k++) {
            res_copy[k] -= coef * f[k];
        }

        res_copy = not_zero(res_copy.map(x => Number(x.toFixed(5))));
    }

    let norm = list_nok[0]; // если первый коэффициент меньше нуля, то умножаем на -1
    if (norm < 0) {
        list_nok = list_nok.map(y => y * (-1));
    }

    return list_nok;
}

// Связь с HTML
document.getElementById("button_1").addEventListener("click", function () {
    let f_x = Array.from(document.querySelectorAll("#f1_inputs input")).map(el => Number(el.value) || 0);
    let g_x = Array.from(document.querySelectorAll("#g1_inputs input")).map(el => Number(el.value) || 0);

    if (f_x.every(x => x === 0) || g_x.every(x => x === 0)) {
        return; // защита от пустого ввода, чтобы не делить на ноль
    }

    let res_nod = nod(not_zero([...f_x]), g_x);
    let res_nok = nok(f_x, g_x, res_nod);

    document.querySelector("#task_1_block #gcd_res").textContent = res_nod.join(" ");
    document.querySelector("#task_1_block #lcm_res").textContent = res_nok.join(" ");
});



