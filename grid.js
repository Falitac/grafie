
class Grid {
  constructor(width, height, scaleSize = 30) {
    let calcDivisions = size =>
      Math.floor(size / scaleSize / 2 + 1) * 2 - 1;

    let calcOffset = (size, divisions) => 
      interpolateNum((size - scaleSize * (divisions - 1)) * 0.5, 0, scaleSize, 0, 1);
    
    this.xDivisions = calcDivisions(width);
    this.yDivisions = calcDivisions(height);

    this.xOffset = calcOffset(width, this.xDivisions);
    this.yOffset = calcOffset(height, this.yDivisions);

    this.xMax = (this.xDivisions - 1 ) * 0.5 + this.xOffset;
    this.xMin = -this.xMax;
    this.yMay = (this.yDivisions - 1 ) * 0.5 + this.yOffset;
    this.yMin = -this.yMay;

    this.points = [];
    

    let halfXDiv = Math.floor(this.xDivisions / 2);
    let halfYDiv = Math.floor(this.yDivisions / 2);
    for(let y = 0; y < this.yDivisions; y++) {
      for(let x = 0; x < this.xDivisions; x++) {
        this.points.push([
          x - halfXDiv,
          y - halfYDiv
        ]);
      }
    }
  }

  getPoint(x, y) {
    return this.points[y * this.yDivisions + x];
  }

  renderScale(ctx) {

  }
}