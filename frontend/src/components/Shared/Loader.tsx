import { TbMathGreater } from "react-icons/tb";
import { TbMathLower } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import "../../styles/Shared/Loader.css";
const Loader = () => {
  return (
    <>
      <div className="loader">
        <FaRegHeart className="loader-icon rotate-origin" />
        <div className="rotations">
          <TbMathLower className="loader-icon" />
          <TbMathGreater className="loader-icon" />
        </div>
      </div>
    </>
  );
};

export default Loader;
