"use client";
import AdminForm from "./adminForm";

function AddAdmin() {
  return (
    <div className="p-5 rounded-lg flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-wide">Add Admin</h1>

      <div className="p-3 flex flex-col gap-3 xl:w-1/2 border rounded-lg">
        {/* OTP Instructions */}
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
          <p>
            <strong>Instructions:</strong> After submitting this form, a 3-digit
            OTP will be sent to the new admin&apos;s email and the core
            company&apos;s email. Both OTPs need to be combined into a 6-digit
            code and entered in the popup to complete the admin creation
            process.
          </p>
        </div>

        {/* Form Section */}
        <AdminForm />
      </div>
    </div>
  );
}

export default AddAdmin;
