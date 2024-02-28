import * as vscode from 'vscode'
import { Provider } from './webview'

export function activate(context: vscode.ExtensionContext) {
	const provider = new Provider(context.extensionUri)
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(Provider.viewType, provider, {
			webviewOptions: {
				retainContextWhenHidden: true
			}
		})
	)
}

export function deactivate() {}
