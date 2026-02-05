import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { getInitials } from "../../utils/helper";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    country: "",
    linkedin: "",
    github: "",
    languages: "",
  });

  const [message, setMessage] = useState("");

  // Load profile from localStorage if exists
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) setProfile(savedProfile);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setMessage("Profile saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl">
              {getInitials(profile.name || "User")}
            </div>
            <h2 className="text-2xl font-semibold">{profile.name || "Your Name"}</h2>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              {message}
            </div>
          )}

          {/* Profile Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                placeholder="Enter your country"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn profile link"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={profile.github}
                onChange={handleChange}
                placeholder="GitHub profile link"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Languages</label>
              <input
                type="text"
                name="languages"
                value={profile.languages}
                onChange={handleChange}
                placeholder="Languages you know (comma separated)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
