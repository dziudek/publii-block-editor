export default class UndoManager {
  constructor () {
    this.history = [];
    this.historyMaxLength = 10;
  }

  saveHistory (blockID, blockContent) {
    console.log('SAVE', blockID, blockContent, typeof blockContent);

    let historyLength = this.history.unshift({
      id: blockID,
      content: JSON.parse(JSON.stringify(blockContent))
    });

    if (historyLength > this.historyMaxLength) {
      console.log('Removed old history');
      this.history = this.history.slice(0, this.historyMaxLength - 1);
    }
  }

  undoHistory (blockID) {
    console.log('UNDO', blockID);

    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].id === blockID) {
        let content = JSON.parse(JSON.stringify(this.history[i].content));
        this.history.splice(i, 1);
        return content;
      }
    }

    console.log('UNDO NOT FOUND!');
  }

  redoHistory (blockID) {

  }
};
