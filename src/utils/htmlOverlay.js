import * as Cesium from "cesium";

export default function htmlOverlay({
  id,
  viewer,
  selectors,
  container = document.body,
  position,
  horizontalOrigin = Cesium.HorizontalOrigin.BOTTOM,
  verticalOrigin = Cesium.VerticalOrigin.CENTER,
  offset = { x: 0, y: 0 },
} = {}) {
  const htmlOverlay = document.querySelector(selectors);
  const clonedElement = htmlOverlay.cloneNode(true);
  clonedElement.id = `${htmlOverlay.id}-${id}`;
  clonedElement.style.position = "absolute";

  // 右上
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.RIGHT &&
    verticalOrigin === Cesium.VerticalOrigin.TOP
  ) {
    clonedElement.style.transform = "origin(50%, 0)";
  }
  // 右下
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.RIGHT &&
    verticalOrigin === Cesium.VerticalOrigin.BOTTOM
  ) {
    clonedElement.style.transform = "origin(50%, 100%)";
  }
  // 右中
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.RIGHT &&
    verticalOrigin === Cesium.VerticalOrigin.CENTER
  ) {
    clonedElement.style.transform = "origin(50%, -50%)";
  }
  // 中上
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.CENTER &&
    verticalOrigin === Cesium.VerticalOrigin.TOP
  ) {
    clonedElement.style.transform = "origin(-50%, 0)";
  }
  // 中下
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.CENTER &&
    verticalOrigin === Cesium.VerticalOrigin.BOTTOM
  ) {
    clonedElement.style.transform = "origin(-50%, 100%)";
  }
  // 中中
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.CENTER &&
    verticalOrigin === Cesium.VerticalOrigin.CENTER
  ) {
    clonedElement.style.transform = "origin(-50%, -50%)";
  }
  // 左上
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.LEFT &&
    verticalOrigin === Cesium.VerticalOrigin.TOP
  ) {
    clonedElement.style.transform = "origin(0, 0)";
  }
  // 左下
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.LEFT &&
    verticalOrigin === Cesium.VerticalOrigin.BOTTOM
  ) {
    clonedElement.style.transform = "origin(0, 100%)";
  }
  // 左中
  if (
    horizontalOrigin === Cesium.HorizontalOrigin.LEFT &&
    verticalOrigin === Cesium.VerticalOrigin.CENTER
  ) {
    clonedElement.style.transform = "origin(0, -50%)";
  }
  container.appendChild(clonedElement);
  const scratch = new Cesium.Cartesian2();
  viewer.scene.preRender.addEventListener(function () {
    const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
      position,
      scratch,
    );
    const cameraPosition = viewer.scene.camera.position;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
    const isOccluded = occluder.isPointVisible(position);
    if (Cesium.defined(canvasPosition) && isOccluded) {
      clonedElement.style.top = `${canvasPosition.y + offset.y}px`;
      clonedElement.style.left = `${canvasPosition.x + offset.x}px`;
      clonedElement.style.display = "block";
    } else {
      clonedElement.style.display = "none";
    }
  });
}
