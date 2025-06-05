import { FaFacebook, FaPhoneAlt, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <div className=" px-[30px] py-[40px] flex items-start justify-between">
      <div className="flex justify-start  flex-col space-y-4 w-1/4 select-none">
        <div className="text-white text-[20px] font-bold">CINE ZONE</div>
        <div className="text-slate-300">
          Experience the magic of cinema with premium viewing experiences, the
          latest blockbusters, and exceptional service.
        </div>
        <div className="flex items-center space-x-3 text-slate-300">
          <div
            role="button"
            className="hover:text-slate-200 active:text-slate-100 active:scale-[1.1] transition-all duration-200"
          >
            <FaFacebook size={20} />
          </div>
          <div
            role="button"
            className="hover:text-slate-200 active:text-slate-100 active:scale-[1.1] transition-all duration-200"
          >
            <FaTwitter size={20} />
          </div>
          <div
            role="button"
            className="hover:text-slate-200 active:text-slate-100 active:scale-[1.1] transition-all duration-200"
          >
            <RiInstagramFill size={20} />
          </div>
          <div
            role="button"
            className="hover:text-slate-200 active:text-slate-100 active:scale-[1.1] transition-all duration-200"
          >
            <FaYoutube size={20} />
          </div>
        </div>
      </div>
      <div className="flex justify-start  flex-col space-y-4 w-1/4 select-none">
        <div className="text-white text-[20px] font-bold ">Quick links</div>
        <div className="flex flex-col justify-start text-slate-300 space-y-3">
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Movies
          </div>
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Cinemas
          </div>
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Promotions
          </div>
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Membership
          </div>
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Gift Cards
          </div>
          <div
            role="button"
            className="hover:text-slate-200 hover:underline active:text-slate-100 active:scale-95 transition-all duration-200"
          >
            Corporate Sales
          </div>
        </div>
      </div>
      <div className="flex justify-start  flex-col space-y-4 w-1/4">
        <div className="text-white text-[20px] font-bold select-none">
          Contact Us
        </div>
        <div className="flex flex-col justify-start space-y-3 text-slate-300">
          <div className="flex items-center ">
            <FaPhoneAlt size={20} color="#6a57f5" className="mr-2" /> +84 (28)
            3775 3535
          </div>
          <div className="flex items-center space-x-2">
            <MdEmail size={20} color="#6a57f5" className="mr-2" />{" "}
            info@cinestar.com.vn
          </div>
          <div className="flex items-start space-x-2">
            <FaLocationDot size={20} color="#6a57f5" className="mr-2" /> 271
            Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, Tp. Hồ Chí Minh
          </div>
        </div>
      </div>
      <div className="flex justify-start  flex-col space-y-4 w-1/4">
        <div className="text-white text-[20px] font-bold select-none">
          Newsletter
        </div>{" "}
        <div className="flex flex-col justify-start space-y-3 text-slate-300">
          <p className="select-none">
            Subscribe to our newsletter for updates, promotions, and exclusive
            offers.
          </p>
          <input
            type="text"
            name=""
            id=""
            className="bg-slate-800 p-2 rounded-xl focus:outline-0"
            placeholder="Your email address"
          />
          <div
            role="button"
            className="bg-[#6a57f5]  select-none rounded-4xl  text-white font-bold p-2 hover:bg-[#6957f5ea]  active:bg-[#6957f5ce]  text-[20px] flex justify-center items-center"
          >
            Subscribe{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
