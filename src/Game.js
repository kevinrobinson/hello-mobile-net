import * as tfc from '@tensorflow/tfjs-core';
import {MobileNet} from './scavenger/mobile_net';
import {Camera, VIDEO_PIXELS} from './scavenger/camera';


export class Game {
  constructor(videoElement) {
    this.emojiScavengerMobileNet = new MobileNet();
    this.camera = new Camera(videoElement);
  }

  init() {
    return Promise.all([
      this.emojiScavengerMobileNet.load().then(() => this.warmUpModel()),
      this.camera.setupCamera().then(value => {
        this.camera.setupVideoDimensions(value[0], value[1]);
      }),
    ]);
  }

  /**
   * Ensures the MobileNet prediction model in tensorflow.js is ready to
   * accept data when we need it by triggering a predict call with zeros to
   * preempt the predict tensor setups.
   */
  warmUpModel() {
    this.emojiScavengerMobileNet.predict(tfc.zeros([VIDEO_PIXELS, VIDEO_PIXELS, 3]));
  }

  /**
   * The game MobileNet predict call used to identify content from the camera
   * and make predictons about what it is seeing.
   */
  async predict() {
    // Run the tensorflow predict logic inside a tfc.tidy call which helps
    // to clean up memory from tensorflow calls once they are done.
    const result = tfc.tidy(() => {

      // For UX reasons we spread the video element to 100% of the screen
      // but our traning data is trained against 244px images. Before we
      // send image data from the camera to the predict engine we slice a
      // 244 pixel area out of the center of the camera screen to ensure
      // better matching against our model.
      const pixels = tfc.fromPixels(this.camera.videoElement);
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
    const topK = await this.emojiScavengerMobileNet.getTopKClasses(result, 10);
    return topK;
  }
}
