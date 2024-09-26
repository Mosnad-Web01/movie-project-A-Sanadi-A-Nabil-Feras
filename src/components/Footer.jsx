import Image from "next/image"
import { footerImg } from '../util/local-ImageConstants'; 
const Footer = () => {
  return (
    <footer className="bg-[#032541] py-16 text-white dark:bg-[#02345c]">
      <div className="container mx-auto flex flex-col justify-between items-center gap-4 md:flex-row md:items-start">
        <nav className="flex flex-col gap-10">
          <div className="flex md:justify-end">
            <Image src={footerImg} alt="footer logo" className="w-40" />
          </div>
          <div>
            <button className=" bg-white px-5 py-4 rounded-lg font-bold text-[#01b4e4]">
              Join the Community
            </button>
          </div>
        </nav>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-xl">THE BASICS</h3>
          <ul className="text-gray-400 flex flex-col gap-1">
            <li>About TMDB</li>
            <li>Contact Us</li>
            <li>Support Forums</li>
            <li>API</li>
            <li>System Status</li>
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-xl">Get Involved</h3>
          <ul className="text-gray-400 flex flex-col gap-1">
            <li>Contribution Bible</li>
            <li>Add New Movie</li>
            <li>Add New TV Show</li>
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-xl">Community</h3>
          <ul className="text-gray-400 flex flex-col gap-1">
            <li>Guidelines</li>
            <li>Discussions</li>
            <li>Leaderboard</li>
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-xl">Legal</h3>
          <ul className="text-gray-400 flex flex-col gap-1">
            <li>API Terms of Use</li>
            <li>Privacy Policy</li>
            <li>DMCA Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
