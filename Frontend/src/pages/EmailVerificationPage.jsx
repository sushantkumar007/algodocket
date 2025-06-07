import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const EmailVerificationPage = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuthStore();
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  let isEmailVerificationChecked = false;
  const navigate = useNavigate();

  const verify = async function () {
    if (!isEmailVerificationChecked) {
      try {
        const res = await verifyEmail(token);
        setData(res);
      } catch (error) {
        setError(error.message)
      }
      isEmailVerificationChecked = true;
    }
  };
  verify();
  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img
                  src="src/assets/Logo.png"
                  className="h-10 w-10 bg-primary/20 text-primary border-none rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {data.status == 200 ? `Hello, ${data?.data.user.name}` : ""}
              </h1>
              <p className="text-base-content/60">{data?.message}</p>
              {error && <p className="text-red-600 text-center">{error}</p>}
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={() => navigate("/login")}
          >
            Login now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
