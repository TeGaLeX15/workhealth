// app/(app)/loading.tsx

/**
 * Loading UI для защищённой части BodyOS.
 *
 * Отображается Next.js во время ожидания загрузки содержимого
 * страницы или серверных данных внутри app route.
 */
export default function Loader() {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
      role="status"
      aria-label="Загрузка"
    >
      <div className="bodyos-loader">
        <svg width="64" height="48" viewBox="0 0 64 48" aria-hidden="true">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            className="bodyos-loader-back"
          />

          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            className="bodyos-loader-front"
          />
        </svg>
      </div>
    </div>
  );
}
