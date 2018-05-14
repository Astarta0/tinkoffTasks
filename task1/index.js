/**
 * Task 1
 * https://github.com/Astarta0/tinkoffTasks/tree/master/task1
 *
 * Демо на codepen:
 *   https://codepen.io/astarta0/pen/wjxrLV
 *
 * Задача:
 *   Фронтендер добавила в чат поддержки виджет emoji и отдала в тестирование.
 *   «У меня одни квадраты», — сообщил тестировщик с Linux. «Может, цветными их
 *   сделаем?» — спросил технолог c Windows 7.
 *   Помогите доделать виджет — поддержите цветные emoji для всех популярных браузеров,
 *   сохраняя нативные иконки «под капотом». Наверняка придется прибегнуть к помощи сторонних
 *   библиотек, но все они работают медленнее нативных смайлов. Придется исхитриться,
 *   чтобы не испортить клиентам впечатление длительными прокрутками или скачиванием
 *   всего бандла картинок при открытии виджета с emoji.
 *
 *  Комментарии к решению:
 *    1) подключила полифил для codePointAt, чтобы получить UTF-16 код символа
 *    2) поддержка эмоджи определяется специальной функцией (взято из Modernizr библиотеки)
 *    3) картинки для эмоджи (в случае отсутствия поддержки) берутся с публичного cdn
 *
 *  Ограничения:
 *    1) hasEmojiSupport() не совсем корректно определяет поддержку эмоджи при наличии масштабирования
 *       на странице; думаю это можно исправить немного изменив функцию, взяв другие координаты для проверки
 */

const picker = document.querySelector('.emoji-picker');
const message = document.querySelector('.message');
const checkStatus = hasEmojiSupport();

const EMOJI_DATA = [
    {
        title: 'Люди',
        icons: ['😃', '😁', '😅', '😇', '😍', '🤡', '🤠', '😎', '😡', '😨', '😭']
    },
    {
        title: 'Котики',
        icons: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
    },
    {
        title: 'Жесты',
        icons: ['👍', '👎', '👊', '✊', '✌️', '🤘']
    }
];

function addIcon(icon) {
    if (!checkStatus) {
        message.innerHTML += `${getEmojiImg(icon)}`;
    } else {
        message.innerHTML += icon;
    }
}

function renderEmojiList(icons) {
    if (!checkStatus) {
        return icons.map(icon => {
            return `
                <li onclick="addIcon('${icon}')">
                   ${getEmojiImg(icon)}
                </li>
            `;
        }).join('');
    } else {
        return icons.map(icon =>
            `<li onclick="addIcon('${icon}')">${icon}</li>`
        ).join('');
    }
}

function renderIconsGroup(group) {
    return `
        <section>
          <h2>${group.title}</h2>
          <ul>
            ${renderEmojiList(group.icons)}
          </ul>
        </section>
    `;
}

function renderIcons(emojiData) {
    return emojiData.map(group => renderIconsGroup(group)).join('');
}


function getEmojiImg(icon) {
    let codeIconHex = icon.codePointAt(0).toString(16)
    return `
        <img class="emoji-img"
        src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/png/${codeIconHex}.png"
        >
    `;
}

picker.innerHTML = renderIcons(EMOJI_DATA);