const picker = document.querySelector('.emoji-picker');
const message = document.querySelector('.message');

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
]

function addIcon(icon) {
    message.innerHTML += icon;
}

function renderEmojiList(icons) {
    return icons.map(icon =>
        `<li onclick="addIcon('${icon}')">${icon}</li>`
    ).join('');
}

function renderIconsGroup(group) {
    return `
    <section>
      <h2>${group.title}</h2>
      <ul>
        ${renderEmojiList(group.icons)}
      </ul>
    </section>
`
}

function renderIcons(emojiData) {
    return emojiData.map(group => renderIconsGroup(group)).join('');
}

picker.innerHTML = renderIcons(EMOJI_DATA);