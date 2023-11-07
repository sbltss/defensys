import { Drawer, Form, message } from "antd";
import React, { useState } from "react";
import { searchCitizen } from "../../../../../../store/api/citizen-api";
import SearchCitizenForm from "./SearchCItizenForm";
import SearchCitizenTable from "./SearchCitizenTable";

const SearchCitizenDrawer = ({ open, setOpen, setReportingCitizen }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchedCitizens, setSearchedCitizens] = useState([]);
  const searchCitizenHandler = async (e) => {
    setLoading(true);
    const response = await searchCitizen(e);
    if (!response.data.length) message.info("No results found");
    setSearchedCitizens(response.data);
    setLoading(false);
  };
  return (
    <Drawer
      title={"Search citizen"}
      height={"80vh"}
      placement="bottom"
      onClose={() => setOpen(false)}
      open={open}
      footer={undefined}
    >
      <div className="w-full h-full flex flex-col gap-16">
        <div className="w-full">
          <SearchCitizenForm
            loading={loading}
            setOpen={setOpen}
            form={form}
            searchCitizenHandler={searchCitizenHandler}
            setReportingCitizen={setReportingCitizen}
          />
        </div>
        <div className="w-full h-full">
          <SearchCitizenTable
            setOpen={setOpen}
            data={searchedCitizens}
            setReportingCitizen={setReportingCitizen}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default SearchCitizenDrawer;
