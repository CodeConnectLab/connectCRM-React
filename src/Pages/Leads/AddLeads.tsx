import React, { useState } from "react";
import { toast } from "react-toastify";
import SelectGroupOne from "../../components/FormElements/SelectGroup/SelectGroupOne";
import type { CollapseProps } from "antd";
import AdditionalLeadDetails from "./AdditionalLeadDetails";
import CustomCollapse from "../../components/FormElements/CustomCollapse";
import DateTimePicker from "../../components/FormElements/DatePicker/DateTimePicker";
import ButtonDefault from "../../components/Buttons/ButtonDefault";
import InputGroup from "../../components/FormElements/InputGroup";
import LeadStatusUI from "../../components/CommonUI/LeadStatus/LeadStatus";
import { API } from "../../api";
import {
  getStoredAgents,
  getStoredProductsServices,
  getStoredSources,
} from "../../api/commonAPI";
import MiniLoader from "../../components/CommonUI/Loader/MiniLoader";

interface AdditionalDetails {
  fullAddress: string;
  country: string;
  state: string;
  city: string;
  website: string;
  companyName: string;
  leadCost: string;
  alternatePhone: string;
  pinCode: string;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  leadSource: string;
  productService: string;
  assignedAgent: string;
  leadStatus: string;
  followUpDate: string;
  description: string;
  additionalDetails?: AdditionalDetails;
}

const initialFormState: LeadFormData = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  leadSource: "",
  productService: "",
  assignedAgent: "",
  leadStatus: "",
  followUpDate: "",
  description: "",
  additionalDetails: {
    fullAddress: "",
    country: "",
    state: "",
    city: "",
    website: "",
    companyName: "",
    leadCost: "",
    alternatePhone: "",
    pinCode: "",
  },
};

export default function AddLeads() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>(initialFormState);

  // Get stored data for dropdowns
  const agentList = getStoredAgents(true);
  const serviceList = getStoredProductsServices(true);
  const sourceList = getStoredSources(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    name: string,
    value: string | number | string[] | number[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (_selectedDates: Date[], dateStr: string) => {
    setFormData((prevData) => ({
      ...prevData,
      followUpDate: dateStr || "",
    }));
  };

  const handleAdditionalDetailsChange = (details: AdditionalDetails) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetails: details,
    }));
  };

  const validateForm = () => {
    // Explicitly define which fields we can access with string index
    type RequiredFieldKey = keyof Pick<
      LeadFormData,
      | "email"
      | "contactNumber"
      | "leadSource"
      | "productService"
      | "assignedAgent"
      | "leadStatus"
    >;
    const requiredFields: RequiredFieldKey[] = [
      "email",
      "contactNumber",
      "leadSource",
      "productService",
      "assignedAgent",
      "leadStatus",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare API payload
      const payload = {
        ...formData,
        ...(formData.additionalDetails || {}),
        // Convert string amounts to numbers where needed
        leadCost: formData.additionalDetails?.leadCost
          ? Number(formData.additionalDetails.leadCost)
          : undefined,
      };

      // Remove nested additionalDetails since we've spread it
      delete payload.additionalDetails;

      const { data, error, message } = await API.postAuthAPI(
        payload,
        "lead",
        true
      );

      if (error || !data) {
        return;
      }

      toast.success(message || "Lead created successfully!");

      // Reset form
      setFormData(initialFormState);
    } catch (error: any) {
      console.error(error.message || "Failed to create lead");
    } finally {
      setIsLoading(false);
    }
  };

  // Configure collapse items for additional details
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <span className="text-body-sm font-medium text-white">
          Additional details
        </span>
      ),
      children: (
        <AdditionalLeadDetails
          onDetailsChange={handleAdditionalDetailsChange}
          initialData={formData.additionalDetails}
        />
      ),
    },
  ];

  if (isLoading) {
    return <MiniLoader />;
  }

  return (
    <div className="mt-auto w-auto">
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Basic Details
              </h3>
              <ButtonDefault label="↓ Import" mode="link" link="/import" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="w-full p-6.5">
                {/* Name Fields */}
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="First name"
                    name="firstName"
                    type="text"
                    placeholder="Enter lead's first name"
                    customClasses="w-full xl:w-1/2"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <InputGroup
                    label="Last name"
                    name="lastName"
                    type="text"
                    placeholder="Enter lead's last name"
                    customClasses="w-full xl:w-1/2"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Contact Fields */}
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter lead's email address"
                    customClasses="w-full xl:w-1/2"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="Contact number"
                    name="contactNumber"
                    type="tel"
                    required
                    placeholder="Enter lead's contact number"
                    customClasses="w-full xl:w-1/2"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Source and Service Fields */}
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <SelectGroupOne
                      label="Lead source"
                      options={sourceList}
                      required
                      selectedOption={formData.leadSource}
                      setSelectedOption={(value) =>
                        handleSelectChange("leadSource", value)
                      }
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <SelectGroupOne
                      label="Product & Service"
                      options={serviceList}
                      required
                      selectedOption={formData.productService}
                      setSelectedOption={(value) =>
                        handleSelectChange("productService", value)
                      }
                    />
                  </div>
                </div>

                {/* Agent and Status Fields */}
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <SelectGroupOne
                      label="Assign to agents"
                      options={agentList}
                      required
                      selectedOption={formData.assignedAgent}
                      setSelectedOption={(value) =>
                        handleSelectChange("assignedAgent", value)
                      }
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <LeadStatusUI
                      handleInputChange={handleInputChange}
                      handleSelectChange={handleSelectChange}
                      formData={formData}
                      statusFieldName="leadStatus"
                    />
                  </div>
                </div>

                {/* Follow-up Date */}
                <div className="mb-4.5 w-full">
                  <DateTimePicker
                    label="Follow-up date"
                    onChange={handleDateChange}
                    defaultValue={new Date().toISOString()}
                  />
                </div>

                {/* Description */}
                <div className="mb-6 w-full">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Enter description / note about lead."
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Additional Details Section */}
                <div className="mb-6 w-full">
                  <CustomCollapse items={items} />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isLoading ? "Creating lead..." : "Add lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
