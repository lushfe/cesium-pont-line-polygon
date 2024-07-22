/**
 * Cesium 绘制点线面
 * 作者：张国庆
 * 最后更新日期：2024-07-22
 *
 * Eg:
 * // 绘制点
 * let draw = new Draw(window.viewer, "point");
 * draw.activate();
 *
 * // 绘制线
 * let draw = new Draw(window.viewer, "line");
 * draw.activate();
 *
 * // 绘制面
 * let draw = new Draw(window.viewer, "polygon");
 * draw.activate();
 *
 * // 取消绘制（取消后可继续绘制，只需要再次激活）
 * draw.deactivate();
 *
 * // 获取绘制数据
 * console.log(draw.points);
 */

import * as Cesium from "cesium";

export default class Draw {
  viewer = null;
  handler = null;
  // 绘制类型
  drawType = null;
  // 绘制的点
  points = [];
  // 绘制中的鼠标点
  mousePoint = null;
  // 绘制中的鼠标点实体
  mouseEntity = null;
  // 数据源
  dataSource = null;

  constructor(viewer, type) {
    viewer.scene.globe.depthTestAgainstTerrain = true;

    this.viewer = viewer;

    this.drawType = type;

    // 禁用实体选择
    this.viewer.screenSpaceEventHandler.setInputAction(
      () => {},
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    this.dataSource = new Cesium.CustomDataSource("draw");
    this.viewer.dataSources.add(this.dataSource);
    this.draw();
  }

  activate() {
    this.addInputAction();
  }

  // 禁用绘制
  deactivate() {
    // 删除鼠标点
    this.removeMousePoint();

    // 删除事件
    this.removeInputAction();
  }

  // 添加事件
  addInputAction() {
    this.handler.setInputAction(
      this.handlerLeftClick.bind(this),
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );
    this.handler.setInputAction(
      this.handlerMouseMove.bind(this),
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );
    this.handler.setInputAction(
      this.handlerRightClick.bind(this),
      Cesium.ScreenSpaceEventType.RIGHT_CLICK,
    );
  }

  handlerLeftClick(e) {
    const position = this.viewer.scene.pickPosition(e.position);
    if (!position) {
      return;
    }
    this.points.push(position);

    if (this.drawType === "point") {
      this.drawPoint(position);
    }
  }

  handlerMouseMove(e) {
    this.removeMousePoint();

    const position = this.viewer.scene.pickPosition(e.endPosition);
    if (!position) {
      return;
    }

    this.mousePoint = position;

    this.mouseEntity = this.dataSource.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试（地形遮挡问题）
      },
    });
  }

  handlerRightClick(e) {
    this.deactivate();
  }

  // 移除事件
  removeInputAction() {
    if (this.handler) {
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
  }

  // 移除鼠标点
  removeMousePoint() {
    if (this.mouseEntity) {
      this.dataSource.entities.remove(this.mouseEntity);
      this.mouseEntity = null;
    }
    if (this.mousePoint) {
      this.mousePoint = null;
    }
  }

  draw() {
    if (this.drawType === "point") {
      this.points.forEach((position) => {
        this.drawPoint(position);
      });
    } else if (this.drawType === "line") {
      this.drawLine(this.points);
    } else if (this.drawType === "polygon") {
      this.drawPolygon(this.points);
    }
  }

  // 绘制点
  drawPoint(position) {
    this.dataSource.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试（地形遮挡问题）
      },
    });
  }

  // 绘制线
  drawLine(positions) {
    this.dataSource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          let c = Array.from(positions);
          if (this.mousePoint) {
            c.push(this.mousePoint);
          }
          return c;
        }, false),
        width: 2,
        material: Cesium.Color.RED,
        clampToGround: true,
      },
    });
  }

  // 绘制面
  drawPolygon(positions) {
    this.dataSource.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          let c = Array.from(positions);
          if (this.mousePoint) {
            c.push(this.mousePoint);
          }
          return new Cesium.PolygonHierarchy(c);
        }, false),
        material: Cesium.Color.RED.withAlpha(0.5),
      },
    });
  }
}
