import { RotatingLines, FidgetSpinner } from "react-loader-spinner";
import './Loader.css'


function Loader() {
    return (
      <div className="loaderCanvas"> 
        <RotatingLines
                strokeColor="#fff"
                strokeWidth="5"
                animationDuration="0.5"
                width="140"
                visible={true}
              />
      </div>
    )
  }

  export default Loader;