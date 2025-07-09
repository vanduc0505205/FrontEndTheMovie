export default function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b">
      <h1 className="text-lg font-semibold">Trang quản trị</h1>
      <div className="flex items-center gap-2">
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-600">Admin</span>
      </div>
    </header>
  )
}
