This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notes
1. add app dependencies
2. yarn add typescript

https://github.com/google/emoji-scavenger-hunt/blob/master/src/js/game.ts

  /**
   * Ensures the MobileNet prediction model in tensorflow.js is ready to
   * accept data when we need it by triggering a predict call with zeros to
   * preempt the predict tensor setups.
   */
  warmUpModel() {
    this.emojiScavengerMobileNet.predict(
        tfc.zeros([VIDEO_PIXELS, VIDEO_PIXELS, 3]));
}


  /**
   * The game MobileNet predict call used to identify content from the camera
   * and make predictons about what it is seeing.
   * @async
   */
  async predict() {

    // Only do predictions if the game is running, ensures performant view
    // transitions and saves battery life when the game isn't in running mode.
    if (this.isRunning) {

      if(this.debugMode) {
        this.stats.begin();
      }

      // Run the tensorflow predict logic inside a tfc.tidy call which helps
      // to clean up memory from tensorflow calls once they are done.
      const result = tfc.tidy(() => {

        // For UX reasons we spread the video element to 100% of the screen
        // but our traning data is trained against 244px images. Before we
        // send image data from the camera to the predict engine we slice a
        // 244 pixel area out of the center of the camera screen to ensure
        // better matching against our model.
        const pixels = tfc.fromPixels(camera.videoElement);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (VIDEO_PIXELS / 2);
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [VIDEO_PIXELS, VIDEO_PIXELS, 3]);

        return this.emojiScavengerMobileNet.predict(pixelsCropped);
      });

      // This call retrieves the topK matches from our MobileNet for the
      // provided image data.
      const topK =
          await this.emojiScavengerMobileNet.getTopKClasses(result, 10);

      // Match the top 2 matches against our current active emoji.
      this.checkEmojiMatch(topK[0].label, topK[1].label);

      // if ?debug=true is passed in as a query param show the topK classes
      // on screen to help with debugging.
      if (this.debugMode) {
        ui.predictionResultsEl.style.display = 'block';
        ui.predictionResultsEl.innerText = '';

        for (const item of topK) {
          ui.predictionResultsEl.innerText +=
                `${item.value.toFixed(5)}: ${item.label}\n`;
        }
      }
    }

    if(this.debugMode) {
      this.stats.end();
    }

    // To ensure better page responsiveness we call our predict function via
    // requestAnimationFrame - see goo.gl/1d9cJa
    requestAnimationFrame(() => this.predict());
  }
