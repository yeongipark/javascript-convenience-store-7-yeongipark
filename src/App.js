import StoreController from './controller/StoreController.js';

class App {
  async run() {
    const storeController = new StoreController();
    await storeController.run();
  }
}

export default App;
