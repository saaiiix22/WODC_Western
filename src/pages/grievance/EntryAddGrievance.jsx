import React, { useState } from 'react'
import { ResetBackBtn } from '../../components/common/CommonButtons'
import {useNavigate } from 'react-router-dom'
import { routes } from '../../router/routeConfig';

const EntryAddGrievance = () => {

    
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
      Add Grievance
    </span> */}
    <button
            onClick={() => 
              navigate(routes.addGrievance.path.replace("/:id?", ""))
            }
            className="px-10 py-3 border-2 border-blue-600 text-blue-600 
                       rounded-lg font-semibold 
                       hover:bg-blue-600 hover:text-white 
                       transition duration-300"
          >
            ➕ Add Grievance
          </button>

    <button
     onClick={() => 
        navigate(routes.grievanceList.path)
      }      className="px-10 py-3 border-2 border-yellow-500 text-yellow-600 
                 rounded-lg font-semibold 
                 hover:bg-gray-500 hover:text-white 
                 transition duration-300"
    >
      🔍 Track Grievance
    </button>
    { <ResetBackBtn/> }

  </div>

</div>

</div>
  )
}

export default EntryAddGrievance
