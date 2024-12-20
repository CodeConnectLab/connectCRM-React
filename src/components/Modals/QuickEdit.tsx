// components/QuickEditModal.tsx
import React, { useState } from "react";
import { Modal } from "antd";
import DateTimePicker from "../../components/FormElements/DatePicker/DateTimePicker";
import CheckboxTwo from "../../components/FormElements/Checkboxes/CheckboxTwo";
import ButtonDefault from "../../components/Buttons/ButtonDefault";
import LeadStatusUI from "../../components/CommonUI/LeadStatus/LeadStatus";

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData: {
    id: string;
    status: string;
    followUpDate: string;
    leadWonAmount: number;
    addCalender: boolean;
  };
  isLoading?: boolean;
}

const QuickEditModal: React.FC<QuickEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    status: initialData.status,
    followup: initialData.followUpDate,
    leadWonAmount: initialData.leadWonAmount || 0,
    addCalender: initialData.addCalender || false,
    comment: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (_selectedDates: Date[], dateStr: string) => {
    setFormData((prev) => ({ ...prev, followup: dateStr }));
  };

  const handleCheckboxChange = ({
    value,
    isChecked,
  }: {
    value: string;
    isChecked: boolean;
  }) => {
    setFormData((prev) => ({ ...prev, [value]: isChecked }));
  };

  const handleSubmit = async () => {
    await onSubmit({
      leadStatus: formData.status,
      followUpDate: formData.followup,
      addCalender: formData.addCalender,
      comment: formData.comment,
    });
  };

  return (
    <Modal
      title="Quick Edit Lead"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="dark:bg-gray-800"
    >
      <div className="space-y-4 py-4">
        <LeadStatusUI
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          formData={formData}
          defaultValue={formData.status}
        />

        <DateTimePicker
          label="Followup"
          onChange={handleDateChange}
          defaultValue={formData.followup}
          enableTime
        />

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Add your comment"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            rows={2}
          />
        </div>

        <div className="flex items-center">
          <CheckboxTwo
            label="Add to Calendar"
            onChange={handleCheckboxChange}
            checked={formData.addCalender}
            idForAPI={"addCalender"}
            id={initialData.id + "Add_to_Calendar_QuickEdit"}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <ButtonDefault
            label="Cancel"
            onClick={onClose}
            variant="secondary"
            customClasses="bg-gray-200 hover:bg-gray-300 text-gray-800"
          />
          <ButtonDefault
            label={isLoading ? "Updating..." : "Update"}
            onClick={handleSubmit}
            variant="primary"
            disabled={isLoading}
            customClasses="bg-primary hover:bg-primary/90 text-white"
          />
        </div>
      </div>
    </Modal>
  );
};

export default QuickEditModal;
