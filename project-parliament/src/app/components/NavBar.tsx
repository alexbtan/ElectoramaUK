const NavBar = () => {
  return (
    <div className="flex flex-wrap place-items-center  w-full">
      <section className="relative mx-auto w-full">
        <nav className="flex justify-between bg-gray-900 text-white w-full">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <h1 className="text-xl hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">Electorama UK</h1>
            <ul className="hidden md:flex mx-auto font-semibold font-heading space-x-12">
              <li className="hover:text-gray-200"><a href="/">Home</a></li>
              <li className="hover:text-gray-200"><a href="https://github.com/alexbtan/OpenParliament">GitHub</a></li>
              <li className="hover:text-gray-200"><a href="/credits">Credits</a></li>
            </ul>
          </div>
        </nav>
        
      </section>
    </div>
  )
}

export default NavBar