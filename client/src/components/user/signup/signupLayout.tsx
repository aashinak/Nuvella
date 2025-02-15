import React from "react";
import SignupImage from "./signupImage";
import SignupForm from "./signupForm";

function SignupLayout() {
  return (
    <div className="flex w-full  min-h-[90vh] ">
      <SignupImage />
      <SignupForm />
    </div>
  );
}

export default SignupLayout;
