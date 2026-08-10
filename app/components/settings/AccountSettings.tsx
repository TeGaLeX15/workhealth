// app/components/settings/AccountSettings.tsx
export default function AccountSettings() {
  return (
    <section className="mt-8">
      <div className="mb-3">
        <h2
          className="
            text-[15px]
            font-bold
            tracking-[-0.02em]
          "
        >
          Аккаунт
        </h2>

        <p className="mt-0.5 text-xs">Управление текущей сессией</p>
      </div>

      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-[20px]
            border
            px-4
            py-4
            text-sm
            font-semibold
            transition
            active:scale-[0.99]
          "
          style={{
            backgroundColor: "color-mix(in srgb, #ef4444 5%, var(--card))",
            borderColor: "color-mix(in srgb, #ef4444 16%, var(--border))",
            color: "#ef4444",
          }}
        >
          Выйти из аккаунта
        </button>
      </form>
    </section>
  );
}
