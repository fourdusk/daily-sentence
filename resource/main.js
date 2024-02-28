const vscode = acquireVsCodeApi()

const sentenceTypeList = [
  {
    label: '动画',
    value: 'a'
  },
  {
    label: '漫画',
    value: 'b'
  },
  {
    label: '游戏',
    value: 'c'
  },
  {
    label: '文学',
    value: 'd'
  },
  {
    label: '原创',
    value: 'e'
  },
  {
    label: '来自网络',
    value: 'f'
  },
  {
    label: '其他',
    value: 'g'
  },
  {
    label: '影视',
    value: 'h'
  },
  {
    label: '诗词',
    value: 'i'
  },
  {
    label: '网易云',
    value: 'j'
  },
  {
    label: '哲学',
    value: 'k'
  },
  {
    label: '抖机灵',
    value: 'l'
  }
]
const getItemTemplate = (typeItem, hasDivider) => {
  const boxTemplate = `
    <div class="sentence-box ${typeItem.value}">
      <div class="sentence-title">
        <div class="sentence-dot"></div>
        <div class="sentence-type">${typeItem.label}</div>
      </div>
      <div class="sentence-content"></div>
      <div class="sentence-footer">
        <span>——</span>
        <span class="sentence-source ml-8"></span>
        <span>
          <span>「</span>
          <span class="sentence-author"></span>
          <span>」</span>
        </span>
      </div>
      <div class="sentence-operation">
        <button type="button" class="button refresh-btn">换一句</button>
      </div>
    </div>
  `
  const dividerTemplate = `
    <div class="divider"></div>
  `
  if (hasDivider) {
    return boxTemplate + dividerTemplate
  } else {
    return boxTemplate
  }
}
let contentTemplate = ''
const containerEl = document.getElementById('container')
for (let i = 0; i < sentenceTypeList.length; i++) {
  contentTemplate += getItemTemplate(sentenceTypeList[i], i < sentenceTypeList.length - 1)
}
containerEl.innerHTML = contentTemplate
const handleRefresh = async typeItem => {
  vscode.postMessage({
    type: 'pullSentence',
    sentenceType: typeItem.value
  })
}

window.addEventListener('message', event => {
  const { type, sentenceType, sentenceContent } = event.data
  switch (type) {
    case 'pushSentence':
      const contentEl = document.querySelector(`.sentence-box.${sentenceType} .sentence-content`)
      const sourceEl = document.querySelector(`.sentence-box.${sentenceType} .sentence-source`)
      const authorEl = document.querySelector(`.sentence-box.${sentenceType} .sentence-author`)
      contentEl.textContent = sentenceContent.hitokoto
      sourceEl.textContent = sentenceContent.from
      authorEl.textContent = sentenceContent.from_who
      break
  }
})

for (const item of sentenceTypeList) {
  handleRefresh(item)
  document
    .querySelector(`.sentence-box.${item.value} .refresh-btn`)
    .addEventListener('click', () => {
      handleRefresh(item)
    })
}
