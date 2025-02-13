// import search from "../assets/search.png";
import message from "../../assets/message.png";
import announcement from "../../assets/announcement.png";
import avatar from "../../assets/avatar.png";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-5">
      {/* Search Bar
      <div className="hidden md:flex items-center gap-2 text-lg rounded-full ring-2 ring-gray-300 px-3 ">
        <img src={search} alt="" width={20} height={20} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div> */}
      {/* Icon and user */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* icon1 */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <img src={message} alt="" width={30} height={30} />
        </div>
        {/* icon2 */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <img src={announcement} alt="" width={30} height={30} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">1</div>
        </div>

        <div className="flex flex-col ">
          <span className="text-sm leading-2 font-medium">John Wick</span>
          <span className="text-sm text-black text-right">User</span>
        </div>
        <div className="">
          <img src={avatar} alt="" width={40} height={40} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
