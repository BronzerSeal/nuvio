import Lottie from "lottie-react";
import animationData from "../animations/choose-company.json";
import { Button } from "@/shared/ui/button";
import React from "react";
import { CreateCompanyModal } from "@/entity/company";

const ChooseCompany = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Lottie animationData={animationData} className="h-48 w-48" />
      <h1>Create or choose company to start</h1>
      <Button onClick={() => setIsOpen((prev) => !prev)}>Select</Button>

      <CreateCompanyModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ChooseCompany;
