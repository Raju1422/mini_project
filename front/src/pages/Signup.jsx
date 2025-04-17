import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye, FaUserCircle } from "react-icons/fa";
import axios from "axios"; // Import axios

const Signup = () => {
  const navigate = useNavigate();
  const [istogg, settogg] = useState(false);
  const [isctogg, setctogg] = useState(false);
  const [fdata, fsetdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    address: "",
    age: "",
    phone: "",
    contacts: ["", "", ""], // Minimum 3, up to 5
  });

  // Update state for form fields
  function onchangefhandle(e) {
    const { name, value } = e.target;
    fsetdata({ ...fdata, [name]: value });
  }

  // Update contact numbers array
  function onchangeContactHandle(index, value) {
    const updatedContacts = [...fdata.contacts];
    updatedContacts[index] = value;
    fsetdata({ ...fdata, contacts: updatedContacts });
  }

  // Submit handler
  async function onhandlefsubmit(e) {
    e.preventDefault();

    // Validate name
    if (!fdata.name.trim()) {
      toast.error("Name is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(fdata.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password and confirm password match
    if (fdata.password !== fdata.confirmpassword) {
      toast.error("Password and its confirmation mismatch");
      return;
    }

    // Validate password strength (e.g., minimum 8 characters)
    if (fdata.password.length < 8) {
      console.log("error is Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/; // Assuming 10-digit phone number
    if (!phoneRegex.test(fdata.phone)) {
      toast.error("Please enter a valid phone number (10 digits)");
      return;
    }

    // Validate contacts array (at least 3 valid contacts)
    if (
      fdata.contacts.length < 3 ||
      fdata.contacts.some((num) => !phoneRegex.test(num))
    ) {
      toast.error(
        "Please provide at least 3 valid contact numbers (10 digits each)"
      );
      return;
    }

    // Validate address
    if (!fdata.address.trim()) {
      toast.error("Address is required");
      return;
    }

    // Validate age (should be 18 or older)
    if (parseInt(fdata.age) < 18) {
      toast.error("You must be at least 18 years old");
      return;
    }

    try {
      // API call to Django backend
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: fdata.name,
        email: fdata.email,
        password: fdata.password,
        password2: fdata.confirmpassword,
        address: fdata.address,
        age: fdata.age,
        phone_number: fdata.phone,
        relatives_phone_numbers: fdata.contacts,
      });

      if (response.status === 201) {
        toast.success("Signup successful!");
        navigate("/login"); // Redirect to login page
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please check your inputs.");
    }
  }

  return (
    <>
      <div className="container max-w-[500px] mx-auto min-h-[800px] my-11 bg-gray-200 text-black rounded-[20px]">
        <div className="font-bold text-center text-2xl text-black p-3">
          SignUP
        </div>
        <div className="userimg text-7xl block w-fit mx-auto relative overflow-hidden">
          <FaUserCircle />
        </div>

        <form className="login-form p-10" onSubmit={onhandlefsubmit}>
          {/* Name */}
          <label htmlFor="name" className="font-bold mx-auto text-xl">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={fdata.name}
            onChange={onchangefhandle}
            required
            className="outline-none my-4 w-full h-9 px-3 rounded"
            placeholder="Enter your Name"
          />

          {/* Email */}
          <label htmlFor="email" className="font-bold mx-auto text-xl">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={fdata.email}
            onChange={onchangefhandle}
            required
            className="outline-none my-4 w-full h-9 px-3 rounded"
            placeholder="Enter your Email"
          />

          {/* Address */}
          <label htmlFor="address" className="font-bold mx-auto text-xl">
            Address
          </label>
          <textarea
            name="address"
            value={fdata.address}
            onChange={onchangefhandle}
            required
            className="outline-none my-4 w-full px-3 h-20 rounded"
            placeholder="Enter your Address"
          ></textarea>

          {/* Age */}
          <label htmlFor="age" className="font-bold mx-auto text-xl">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={fdata.age}
            onChange={onchangefhandle}
            required
            min="18"
            className="outline-none my-4 w-full h-9 px-3 rounded"
            placeholder="Enter your Age"
          />

          {/* Phone */}
          <label htmlFor="phone" className="font-bold mx-auto text-xl">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={fdata.phone}
            onChange={onchangefhandle}
            required
            className="outline-none my-4 w-full h-9 px-3 rounded"
            placeholder="Enter your Phone Number"
          />

          {/* Contacts (Additional Phone Numbers) */}
          <label htmlFor="contacts" className="font-bold mx-auto text-xl">
            Additional Contacts (Min 3, Max 5)
          </label>
          {fdata.contacts.map((contact, index) => (
            <input
              key={index}
              type="tel"
              value={contact}
              onChange={(e) => onchangeContactHandle(index, e.target.value)}
              required={index < 3} // First 3 are mandatory
              className="outline-none my-2 w-full h-9 px-3 rounded"
              placeholder={`Contact ${index + 1}`}
            />
          ))}
          {fdata.contacts.length < 5 && (
            <button
              type="button"
              onClick={() =>
                fsetdata({
                  ...fdata,
                  contacts: [...fdata.contacts, ""],
                })
              }
              className="text-blue-500 hover:underline"
            >
              Add More Contacts
            </button>
          )}

          {/* Password */}
          <label htmlFor="password" className="font-bold text-xl">
            Password
          </label>
          <div className="inputpass flex items-center justify-between px-2 w-full h-9 my-4 bg-white rounded">
            <input
              type={istogg ? "text" : "password"}
              name="password"
              value={fdata.password}
              onChange={onchangefhandle}
              required
              className="outline-none"
              placeholder="Enter Your Password"
            />
            <div onClick={() => settogg(!istogg)}>
              {istogg ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Confirm Password */}
          <label htmlFor="confirmpassword" className="font-bold text-xl">
            Confirm Password
          </label>
          <div className="inputpass flex items-center justify-between px-2 w-full h-9 my-4 bg-white rounded">
            <input
              type={isctogg ? "text" : "password"}
              name="confirmpassword"
              value={fdata.confirmpassword}
              onChange={onchangefhandle}
              required
              className="outline-none"
              placeholder="Confirm Your Password"
            />
            <div onClick={() => setctogg(!isctogg)}>
              {isctogg ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Submit Button */}
          <div className="loginbtn flex justify-center my-10">
            <button
              type="submit"
              className="bg-blue-800 text-center px-5 py-2 rounded-[10px] text-white hover:bg-red-400 hover:text-black hover:scale-125 transition-all"
            >
              Sign UP
            </button>
          </div>

          {/* Link to Login */}
          <div className="lsignin text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 font-bold">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
