import React from "react";

const ViewGeoTag = () => {
  return (
    <div>
      <>
        <div>
          <h1>Geo Mapping</h1>
        </div>
        <div>
          <div>
            <h1 className="bg-light-dark text-white border rounded-t-md p-1 ">
              <strong>Upload Documents</strong>
            </h1>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <InputField type="file" label="Invoice / Work Order" />
            </div>

            <div className="col-span-4">
              <InputField type="file" label="Completion Certificate" />
            </div>

            <div className="col-span-4">
              <InputField type="file" label="Asset Photographs" />
            </div>

            <div className="col-span-6">
              <InputField type="file" label="Other Supporting Documents" />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ViewGeoTag;
