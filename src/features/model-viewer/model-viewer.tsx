import { useState } from 'react';
import type { Model, Point } from './stl';
import styles from './model-viewer.module.css';

export function ModelViewer({ model }: { model: Model }) {
  const [rotation, setRotation] = useState(-0.55);
  const [zoom, setZoom] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  function project([x, y, z]: Point): Point {
    const rx = x * Math.cos(rotation) - y * Math.sin(rotation);
    const ry = x * Math.sin(rotation) + y * Math.cos(rotation);
    return [250 + rx * 220 * zoom, 175 + (ry * 0.48 - z * 0.88) * 220 * zoom, ry + z * 0.5];
  }
  const stride = Math.ceil(model.triangles.length / 1500);
  const faces = model.triangles
    .filter((_, index) => index % stride === 0)
    .map((triangle) => triangle.map(project))
    .sort((a, b) => a.reduce((sum, p) => sum + p[2], 0) - b.reduce((sum, p) => sum + p[2], 0));
  return (
    <div className={styles.viewer}>
      <svg viewBox="0 0 500 350" role="img" aria-label="Предпросмотр геометрии STL-модели">
        <defs>
          <pattern
            id="model-grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
            patternTransform="matrix(1 .3 -1 .3 250 220)"
          >
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect
          x="40"
          y="175"
          width="420"
          height="150"
          fill="url(#model-grid)"
          className={styles.grid}
        />
        {faces.map((face, index) => (
          <polygon
            key={index}
            points={face.map((p) => `${String(p[0])},${String(p[1])}`).join(' ')}
            fill={wireframe ? 'none' : `hsl(176 43% ${String(37 + (index % 5) * 5)}%)`}
            stroke="var(--mesh-stroke, #164e4c)"
            strokeWidth={wireframe ? 0.8 : 0.5}
          />
        ))}
        <text x="452" y="314" className={styles.axis}>
          X
        </text>
        <text x="80" y="314" className={styles.axis}>
          Y
        </text>
        <text x="250" y="28" className={styles.axis}>
          Z
        </text>
      </svg>
      <div className={styles.controls} aria-label="Управление моделью">
        <button
          type="button"
          onClick={() => {
            setRotation(rotation - 0.3);
          }}
          aria-label="Повернуть влево"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => {
            setRotation(rotation + 0.3);
          }}
          aria-label="Повернуть вправо"
        >
          ↷
        </button>
        <span />
        <button
          type="button"
          onClick={() => {
            setZoom(Math.max(0.5, zoom - 0.2));
          }}
          aria-label="Уменьшить модель"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(Math.min(1.8, zoom + 0.2));
          }}
          aria-label="Увеличить модель"
        >
          +
        </button>
        <button
          type="button"
          aria-pressed={wireframe}
          onClick={() => {
            setWireframe(!wireframe);
          }}
        >
          Каркас
        </button>
      </div>
      {stride > 1 && <p className={styles.hint}>Облегчённый просмотр: показана часть граней.</p>}
    </div>
  );
}
