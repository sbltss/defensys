import { Drawer, Form, message } from "antd";
import React, { useState } from "react";
import { searchCitizen } from "../../../../../../../store/api/citizen-api";
import { tagCitizenToTicket } from "../../../../../../../store/api/ticket-api";
import SearchCitizenForm from "./SearchCitizen/SearchCItizenForm";
import SearchCitizenTable from "./SearchCitizen/SearchCitizenTable";

const TagCitizenDrawer = ({ tagTicket, closeDrawer }) => {
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
  const tagCitizenHandler = async (citizen) => {
    let messageLoading;
    messageLoading = message.loading("Tagging citizen...");
    const request = await tagCitizenToTicket({
      body: {
        accountId: citizen.accountId,
        transactionNumber: tagTicket.transactionNumber,
      },
    });
    messageLoading();
    if (!request || request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      closeDrawer();
    }
  };

  return (
    <Drawer
      height={"60vh"}
      onClose={closeDrawer}
      open={!!tagTicket}
      placement="bottom"
      title="Tag a registered citizen to this ticket"
    >
      <div className="w-full">
        <SearchCitizenForm
          loading={loading}
          form={form}
          searchCitizenHandler={searchCitizenHandler}
        />
      </div>
      <div className="w-full h-full">
        <SearchCitizenTable
          tagCitizen={tagCitizenHandler}
          data={searchedCitizens}
        />
      </div>
    </Drawer>
  );
};

export default TagCitizenDrawer;
