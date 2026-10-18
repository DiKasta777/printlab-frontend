import { useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { env } from '@/shared/config/env';
import { ModelViewer } from '@/features/model-viewer/model-viewer';
import { EXAMPLE_MODEL, MAX_FILE_SIZE, parseStl } from '@/features/model-viewer/stl';
import type { Model } from '@/features/model-viewer/stl';
import styles from './home-page.module.css';

const experiments: [number, number, number, number][] = [
  [10, 48, 12.1, 38],
  [20, 92, 18.3, 55],
  [30, 156, 24.7, 74],
  [40, 208, 31.2, 92],
  [50, 235, 37.5, 110],
  [70, 268, 48.1, 141],
];

interface Result {
  material: string;
  load: number;
  factor: number;
  layer: string;
  walls: string;
  priority: string;
  orientation: string;
  requirements: string[];
  file: string;
}

export function HomePage() {
  const [light, setLight] = useState(false);
  const [model, setModel] = useState<Model | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const upload = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const id = ++requestId.current;
    event.target.value = '';
    setLoading(false);
    setError('');
    setMessage('');
    setResult(null);
    setModel(null);
    setFileName('');
    if (!/\.stl$/i.test(file.name)) {
      setError('Выберите файл с расширением .stl.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Файл больше 15 МБ. Выберите модель меньшего размера.');
      return;
    }
    setLoading(true);
    try {
      const parsed = parseStl(await file.arrayBuffer());
      if (requestId.current !== id) return;
      setModel(parsed);
      setFileName(file.name);
      setMessage('Модель успешно загружена.');
    } catch {
      if (requestId.current === id)
        setError(
          'Не удалось загрузить модель. Проверьте STL: до 15 МБ, до 100 000 граней, корректные координаты.',
        );
    } finally {
      if (requestId.current === id) {
        setLoading(false);
        event.target.value = '';
      }
    }
  }

  function showDemo(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setResult({
      material: values.get('material') as string,
      load: Number(values.get('load')),
      factor: Number(values.get('factor')),
      layer: values.get('layer') as string,
      walls: values.get('walls') as string,
      priority: values.get('priority') as string,
      orientation: values.get('orientation') as string,
      requirements: values.getAll('requirements') as string[],
      file: fileName || 'Пример модели',
    });
    setMessage('Демонстрационный результат показан. Расчёт на сервере не выполнялся.');
  }

  return (
    <div className={[styles.page, light ? styles.light : ''].join(' ')}>
      <header className={styles.header}>
        <a className={styles.brand} href={import.meta.env.BASE_URL}>
          <span className={styles.logo} aria-hidden="true">
            P<span>³</span>
          </span>
          <span>
            <strong>Infill Lab</strong>
            <small>Оптимизация параметров 3D-печати</small>
          </span>
        </a>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.theme}
            onClick={() => {
              setLight(!light);
            }}
            aria-label={light ? 'Включить тёмную тему' : 'Включить светлую тему'}
          >
            {light ? '◐' : '☀'}
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={() => upload.current?.click()}
            disabled={loading}
          >
            ↑ <span>{loading ? 'Чтение STL…' : 'Загрузить модель'}</span>
          </button>
        </div>
      </header>
      <main id="main-content" className={styles.main}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>PRINTLAB / РАБОЧЕЕ ПРОСТРАНСТВО</p>
            <h1>
              Меньше материала.
              <br className={styles.mobileBreak} /> Больше возможностей.
            </h1>
          </div>
          <span className={styles.badge}>Демо интерфейса</span>
        </div>
        <p className={styles.apiNotice}>
          Сервер расчётов ещё не подключён. Вы можете просмотреть STL и проверить форму; результаты
          ниже — пример из макета.
        </p>
        <input
          ref={upload}
          id="stl-upload"
          className={styles.fileInput}
          type="file"
          accept=".stl"
          aria-label="Выберите STL-модель"
          onChange={(event) => {
            void readFile(event);
          }}
        />
        <div role="alert" className={error ? styles.error : styles.silent}>
          {error}
        </div>
        <div role="status" className={message ? styles.success : styles.silent}>
          {message}
        </div>
        <div className={styles.workspace}>
          <section
            className={[styles.panel, styles.modelPanel].join(' ')}
            aria-labelledby="model-heading"
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.step}>01 / ГЕОМЕТРИЯ</span>
                <h2 id="model-heading">3D-модель</h2>
                <p>Просмотр загруженной STL-модели</p>
              </div>
              <span className={styles.fileBadge}>{model ? 'STL' : 'ПРИМЕР'}</span>
            </div>
            <div className={styles.viewport} aria-busy={loading}>
              <span className={styles.viewLabel}>ПЕРСПЕКТИВА / XYZ</span>
              <ModelViewer key={fileName} model={model ?? EXAMPLE_MODEL} />
              {!model && (
                <p className={styles.exampleLabel}>Пример геометрии · загрузите свою STL-модель</p>
              )}
            </div>
            <div className={styles.modelFooter}>
              <div>
                <strong>{fileName || 'Модель ещё не загружена'}</strong>
                <small>
                  {model
                    ? `${model.triangles.length.toLocaleString('ru-RU')} граней · размер ${model.dimensions.map((v) => v.toFixed(1)).join(' × ')} ед. STL`
                    : 'ASCII и бинарный STL · до 15 МБ'}
                </small>
              </div>
              {model && (
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => {
                    setModel(null);
                    setFileName('');
                    setResult(null);
                    setMessage('Модель удалена.');
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </section>
          <section
            className={[styles.panel, styles.parameters].join(' ')}
            aria-labelledby="parameters-heading"
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.step}>02 / УСЛОВИЯ</span>
                <h2 id="parameters-heading">Параметры оптимизации</h2>
                <p>Задайте условия эксплуатации и ограничения</p>
              </div>
            </div>
            <form
              onSubmit={showDemo}
              onChange={() => {
                setResult(null);
                setMessage('');
              }}
            >
              <div className={styles.fields}>
                <label>
                  Материал
                  <select aria-label="Материал" name="material" defaultValue="PLA">
                    <option>PLA</option>
                    <option>PETG</option>
                    <option>ABS</option>
                  </select>
                </label>
                <fieldset className={styles.requirements}>
                  <legend>Требования</legend>
                  {[
                    'Минимальный вес',
                    'Максимальная прочность',
                    'Ограничение по времени печати',
                  ].map((label, i) => (
                    <label key={label}>
                      <input
                        type="checkbox"
                        name="requirements"
                        value={label}
                        defaultChecked={i === 0}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
                <label>
                  Максимальная нагрузка, Н
                  <input
                    name="load"
                    type="number"
                    min="0.1"
                    max="1000000"
                    step="any"
                    defaultValue="100"
                    required
                  />
                </label>
                <label>
                  Высота слоя, мм
                  <input
                    name="layer"
                    type="number"
                    min="0.05"
                    max="1"
                    step="0.01"
                    defaultValue="0.2"
                    required
                  />
                </label>
                <label>
                  Коэффициент запаса прочности
                  <input
                    name="factor"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    defaultValue="2"
                    required
                  />
                </label>
                <label>
                  Количество периметров
                  <input
                    name="walls"
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    defaultValue="3"
                    required
                  />
                </label>
                <label>
                  Приоритет оптимизации
                  <select name="priority">
                    <option>Минимальный расход материала</option>
                    <option>Максимальная прочность</option>
                    <option>Минимальное время печати</option>
                  </select>
                </label>
                <label>
                  Ориентация печати
                  <select name="orientation">
                    <option>Авто (в демо не рассчитывается)</option>
                    <option>По оси X</option>
                    <option>По оси Y</option>
                    <option>По оси Z</option>
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className={[styles.primary, styles.run].join(' ')}
                disabled={loading}
              >
                Показать деморезультат <span aria-hidden="true">→</span>
              </button>
              <p className={styles.formHint}>
                Значения формы сохраняются в примере. Подбор параметров будет доступен после
                подключения API.
              </p>
            </form>
          </section>
        </div>
        <section
          className={[styles.panel, styles.results].join(' ')}
          aria-labelledby="results-heading"
        >
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.step}>03 / РЕЗУЛЬТАТ</span>
              <h2 id="results-heading">Результаты оптимизации</h2>
              <p>
                {result
                  ? 'Демонстрационные значения из макета — не инженерный расчёт'
                  : 'Настройте параметры и нажмите «Показать деморезультат»'}
              </p>
            </div>
            <span className={styles.fileBadge}>{result ? 'ДЕМО' : 'ОЖИДАНИЕ'}</span>
          </div>
          {result ? (
            <>
              <div className={styles.resultGrid}>
                <div className={styles.summary}>
                  <h3>Пример рекомендуемых параметров</h3>
                  <div className={styles.metrics}>
                    <div className={styles.ring}>
                      <strong>
                        40<span>%</span>
                      </strong>
                    </div>
                    <div>
                      <span className={styles.metricLabel}>Прочность</span>
                      <strong className={styles.metricValue}>
                        215 <small>Н</small>
                      </strong>
                      <span className={styles.metricLabel}>Расход материала</span>
                      <strong className={styles.metricValue}>
                        28,4 <small>г</small>
                      </strong>
                    </div>
                  </div>
                  <dl>
                    <div>
                      <dt>Тип заполнения</dt>
                      <dd>Gyroid</dd>
                    </div>
                    <div>
                      <dt>Высота слоя</dt>
                      <dd>0,2 мм</dd>
                    </div>
                    <div>
                      <dt>Периметры</dt>
                      <dd>3</dd>
                    </div>
                    <div>
                      <dt>Время печати</dt>
                      <dd>1 ч 45 мин</dd>
                    </div>
                  </dl>
                  <p className={styles.formHint}>
                    Фиксированный пример. Эти цифры не зависят от вашей модели и введённых
                    параметров.
                  </p>
                </div>
                <div className={styles.chart}>
                  <h3>Сравнение с экспериментальными данными</h3>
                  <svg
                    viewBox="0 0 360 245"
                    role="img"
                    aria-label="Демонстрационная прочность: при заполнении от 10 до 70 процентов, от 48 до 268 Н. Данные приведены в таблице рядом."
                  >
                    {[0, 100, 200, 300].map((v) => (
                      <g key={v}>
                        <line x1="40" y1={200 - v / 2} x2="342" y2={200 - v / 2} />
                        <text x="30" y={204 - v / 2} textAnchor="end">
                          {v}
                        </text>
                      </g>
                    ))}
                    <polyline
                      points={experiments
                        .map((row) => `${String(40 + row[0] * 4)},${String(200 - row[1] / 2)}`)
                        .join(' ')}
                    />
                    {experiments.map((row) => (
                      <circle
                        key={row[0]}
                        cx={40 + row[0] * 4}
                        cy={200 - row[1] / 2}
                        r={row[0] === 40 ? 6 : 3.5}
                        className={row[0] === 40 ? styles.selectedPoint : ''}
                      />
                    ))}
                    {[0, 25, 50, 75].map((v) => (
                      <text key={v} x={40 + v * 4} y="220" textAnchor="middle">
                        {v}
                      </text>
                    ))}
                    <text x="190" y="242" textAnchor="middle">
                      Заполнение, %
                    </text>
                    <text x="40" y="30">
                      Прочность, Н
                    </text>
                  </svg>
                </div>
                <div className={styles.tableWrap}>
                  <h3>Экспериментальные данные</h3>
                  <table>
                    <caption>Пример данных из Figma</caption>
                    <thead>
                      <tr>
                        <th scope="col">Заполнение, %</th>
                        <th scope="col">Прочность, Н</th>
                        <th scope="col">Расход, г</th>
                        <th scope="col">Время, мин</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiments.map((row) => (
                        <tr key={row[0]} className={row[0] === 40 ? styles.selectedRow : ''}>
                          {row.map((value, index) => (
                            <td key={index}>{value.toLocaleString('ru-RU')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <details className={styles.submitted}>
                <summary>Параметры вашего запроса</summary>
                <p>
                  {result.file} · {result.material} · {result.load} Н · запас {result.factor} · слой{' '}
                  {result.layer} мм · {result.walls} периметра
                </p>
                <p>
                  {result.priority} · {result.orientation}
                </p>
                <p>Требования: {result.requirements.join(', ') || 'Не выбраны'}</p>
              </details>
            </>
          ) : (
            <div className={styles.emptyResults}>
              <span aria-hidden="true">↗</span>
              <div>
                <strong>Здесь появится результат</strong>
                <p>Заполнение, прочность, расход материала и сравнение с экспериментами</p>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className={styles.footer}>
        <span>
          {env.appName} <span aria-hidden="true">/</span> Infill Lab
        </span>
        <span>Исследовательский проект · прототип интерфейса</span>
      </footer>
    </div>
  );
}
