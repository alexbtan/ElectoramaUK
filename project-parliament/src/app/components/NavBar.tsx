const NavBar = () => {
  return (
    
    <div className="flex flex-wrap place-items-center">
      <section className="relative mx-auto">
        <nav className="flex justify-between bg-gray-900 text-white w-screen">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <h1 className="text-xl hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">Electorama UK</h1>
            <ul className="hidden md:flex mx-auto font-semibold font-heading space-x-12">
              <li><a className="hover:text-gray-200" href="/">Home</a></li>
              <li><a className="hover:text-gray-200" href="https://github.com/alexbtan/OpenParliament">GitHub</a></li>
              <li><a className="hover:text-gray-200" href="#">Credits</a></li>
            </ul>
          </div>
        </nav>
        
      </section>
    </div>
  )
}

export default NavBar