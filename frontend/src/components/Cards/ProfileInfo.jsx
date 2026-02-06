import React from "react";
import { getInitials } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (userInfo && userInfo._id) {
      navigate(`/user/${userInfo._id}/edit`);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo?.fullName)}
      </div>

      {/* Username clickable */}
      <div
        className="flex flex-col cursor-pointer"
        onClick={handleProfileClick}
      >
        <p className="text-sm font-medium text-slate-900 hover:text-primary">
          {userInfo?.fullName || "User"}
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary">
          <span>View Profile</span>
          <MdArrowForwardIos size={12} />
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfo;
