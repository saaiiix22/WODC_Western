import React from 'react'
import { useNavigate } from 'react-router-dom';
import { routes } from '../../router/routeConfig';

const EntryHearingGrievance = () => {
    const navigate = useNavigate();
    return (
      <div>
  
  <div className="border-2 border-blue-500 rounded-2xl 
                  px-16 py-30 shadow-xl mt-30
                  bg-gradient-to-br from-blue-50 to-white">
  
    <div className="flex flex-col md:flex-row 
                    items-center justify-center 
                    gap-6">
       {/* Legend Text */}
       {/* <span className="absolute -top-0 left-6 
                       bg-white px-4  hover:bg-blue-400 hover:text-white
                       text-blue-600 font-semibold text-lg">
        Add Hearing Grievance
      </span> */}
      <button
              onClick={() => 
                navigate(routes.virtualGrievanceHearing.path)
              }
              className="px-10 py-3 border-2 border-blue-600 text-blue-600 
                         rounded-lg font-semibold 
                         hover:bg-blue-600 hover:text-white 
                         transition duration-300"
            >
              ➕ Add Virtual Hearing Grievance
            </button>
  
      <button
         onClick={() => 
            navigate(routes.virtualGrievanceHearingList.path)
          }
        className="px-10 py-3 border-2 border-yellow-500 text-yellow-600 
                   rounded-lg font-semibold 
                   hover:bg-yellow-500 hover:text-white 
                   transition duration-300"
      >
        🔍 Track Virtual Hearing Grievance
      </button>
      {/* <ResetBackBtn/> */}
  
    </div>
  
  </div>
  
  </div>
    )
  }
export default EntryHearingGrievance
