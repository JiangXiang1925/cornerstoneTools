import external from './../externalModules.js';
import baseTool from './../base/baseTool.js';
import { correctShift } from './shared/zoom.js';

export default class extends baseTool {
  constructor (name = 'zoomTouchPinch') {
    super({
      name,
      // TODO: Do we need a better way to specify touchPinch?
      supportedInteractionTypes: ['touch'],
      configuration: {
        minScale: 0.25,
        maxScale: 20.0
      }
    });
  }

  /**
   *
   *
   * @param {*} evt
   */
  touchPinchCallback (evt) {
    const { element, viewport, scaleChange } = evt.detail;
    const [pageStartX, pageStartY, imageStartX, imageStartY] = [
      evt.detail.startPoints.page.x,
      evt.detail.startPoints.page.y,
      evt.detail.startPoints.image.x,
      evt.detail.startPoints.image.y
    ];
    const { maxScale, minScale } = this.configuration;

    // Change the scale based on the pinch gesture's scale change
    viewport.scale += scaleChange * viewport.scale;
    if (maxScale && viewport.scale > maxScale) {
      viewport.scale = maxScale;
    } else if (minScale && viewport.scale < minScale) {
      viewport.scale = minScale;
    }

    external.cornerstone.setViewport(element, viewport);

    // Now that the scale has been updated, determine the offset we need to apply to the center so we can
    // Keep the original start location in the same position
    const newCoords = external.cornerstone.pageToPixel(
      element,
      pageStartX,
      pageStartY
    );
    let shift = {
      x: imageStartX - newCoords.x,
      y: imageStartY - newCoords.y
    };

    shift = correctShift(shift, viewport);
    viewport.translation.x -= shift.x;
    viewport.translation.y -= shift.y;
    external.cornerstone.setViewport(element, viewport);
  }
}
