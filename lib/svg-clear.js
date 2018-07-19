'use babel';

import SvgClearView from './svg-clear-view';
import { CompositeDisposable } from 'atom';

export default {

  svgClearView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.svgClearView = new SvgClearView(state.svgClearViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.svgClearView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that clears this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'svg-clear:clear': () => this.clear()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.svgClearView.destroy();
  },

  serialize() {
    return {
      svgClearViewState: this.svgClearView.serialize()
    };
  },

  clear() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let clearText = selection.replace(/<(title)>(.*?)<\/title>/, '').replace(/>/g, '>\n')
      editor.insertText(clearText)
      atom.notifications.addSuccess('Your svg is formatted')
    }
}


};
