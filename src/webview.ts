import * as vscode from 'vscode'
import axios from 'axios'

function getNonce() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export class Provider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'daily-sentence-view'

  private _view?: vscode.WebviewView

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    }
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
    webviewView.webview.onDidReceiveMessage(async (data: {type:'pullSentence', sentenceType: string}) => {
      const { type, sentenceType } = data
      switch (type) {
        case 'pullSentence':
          const sentenceContent = await axios.get(`https://v1.hitokoto.cn?c=${sentenceType}`).then(r => r.data)
          this._view?.webview.postMessage({
            type: 'pushSentence',
            sentenceType,
            sentenceContent
          })
          break
      }
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resource', 'main.js')
    )
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resource', 'main.css')
    )
    const nonce = getNonce()

    return `
      <!DOCTYPE html>
			<html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${styleUri}" rel="stylesheet">
          <title>Daily Sentence</title>
        </head>
        <body>
          <div id="container"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
			</html>`
  }
}
