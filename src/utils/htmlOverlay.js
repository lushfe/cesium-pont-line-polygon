import * as Cesium from "cesium";

export default function htmlOverlay({
  id,
  viewer,
  elementId,
  container = document.body,
  position,
  horizontalOrigin = Cesium.HorizontalOrigin.BOTTOM,
  verticalOrigin = Cesium.VerticalOrigin.CENTER,
  offset = { x: 0, y: 0 },
  data = {},
  onClick = () => {},
} = {}) {
  const clonedId = `${elementId}-${id}`;
  if (document.getElementById(clonedId)) {
    return;
  }
  const htmlOverlay = document.getElementById(elementId);
  const clonedElement = htmlOverlay.cloneNode(true);
  clonedElement.id = clonedId;
  clonedElement.style.position = "absolute";
  clonedElement.setAttribute(`data-row`, JSON.stringify(data));
  clonedElement.addEventListener("click", function (e) {
    onClick(e, data);
  });

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
    viewer.scene.cartesianToCanvasCoordinates(position, scratch);
    const cameraPosition = viewer.scene.camera.position;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
    const isOccluded = occluder.isPointVisible(position);
    if (Cesium.defined(scratch) && isOccluded) {
      clonedElement.style.top = `${scratch.y + offset.y}px`;
      clonedElement.style.left = `${scratch.x + offset.x}px`;
      clonedElement.style.display = "block";
    } else {
      clonedElement.style.display = "none";
    }
  });

  return clonedElement;
}
