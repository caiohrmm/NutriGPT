export function AuthFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full text-center text-xs text-muted-foreground mt-8">
      <div className="max-w-screen-sm mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-3" />
        © {year} <span className="font-semibold text-green-700">NutriGPT</span>. Saúde, leveza e vitalidade.
      </div>
    </footer>
  );
}


