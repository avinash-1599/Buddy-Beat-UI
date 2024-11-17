import { useSelector } from "react-redux";

const NavBar = () => {
// subscribe to the user store using useSelector hook
    const user = useSelector(store => store.user);
    console.log("useeeeeer", user);

    return (<h1 className="text-3xl font-bold">
    <div className="navbar bg-base-300">
<div className="flex-1">
  <a className="btn btn-ghost text-xl">DevTinder</a>
</div>
<div className="flex-none gap-2">
  {user && (
  <div className="dropdown dropdown-end mx-5 flex">
    <p className="px-4 text-sm text-blue-500 mt-2">Welcome, {user.data.firstName} </p>
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img alt="user photo" src={user.data.photoUrl || '../public/dhoni.png'} />
      </div>
    </div>
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
      <li>
        <a className="justify-between">
          Profile
          <span className="badge">New</span>
        </a>
      </li>
      <li><a>Settings</a></li>
      <li><a>Logout</a></li>
    </ul>
  </div>
  )}
</div>
</div>
  </h1>
  )
}

export default NavBar;