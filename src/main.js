import * as Cesium from "cesium";
import Draw from "./utils/draw.js";
import htmlOverlay from "./utils/htmlOverlay.js";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

window.viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

// 设置相机位置
window.viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    115.39700938394914,
    31.422055522589613,
    1000,
  ),
  orientation: {
    heading: Cesium.Math.toRadians(45.0),
    pitch: Cesium.Math.toRadians(-45.0),
  },
});

// 鼠标左键点击事件
// window.handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
// window.handler.setInputAction((e) => {
//   // 获取经纬度
//   const position = window.viewer.scene.pickPosition(e.position);
//   const cartographic = Cesium.Cartographic.fromCartesian(position);
//   const longitude = Cesium.Math.toDegrees(cartographic.longitude);
//   const latitude = Cesium.Math.toDegrees(cartographic.latitude);
//   const height = cartographic.height;
//   console.log(longitude, latitude, height);
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// 获取按钮
let draw1 = new Draw(window.viewer, "point");
let draw2 = new Draw(window.viewer, "line");
let draw3 = new Draw(window.viewer, "polygon");
btn1.onclick = () => {
  draw1.activate();
}; // 点

btn2.onclick = () => {
  draw2.activate();
}; // 线

btn3.onclick = () => {
  draw3.activate();
}; // 面

btn4.onclick = () => {
  draw1.deactivate();
  draw2.deactivate();
  draw3.deactivate();

  console.log("点", draw1.points);
  console.log("线", draw2.points);
  console.log("面", draw3.points);
};

btn5.onclick = () => {
  draw1.deactivate();
  draw2.deactivate();
  draw3.deactivate();
}; // 取消

// 绘制 html
btn6.onclick = () => {
  htmlOverlay({
    id: "111",
    viewer: window.viewer,
    selectors: "#point1",
    position: Cesium.Cartesian3.fromDegrees(
      115.39700938394914,
      31.422055522589613,
      20,
    ),
  });
};
