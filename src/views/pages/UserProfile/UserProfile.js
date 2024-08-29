import React, { useState } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
} from "@coreui/react";

const UserProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    // Handle saving personal information
    console.log("Saving personal info:", {
      firstName,
      lastName,
      userName,
      email,
      contactPhone,
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Handle password change
    console.log("Changing password:", { password, newPassword });
  };

  return (
    <CRow>
      <CCol xs="12" md="8">
        <CCard>
          <CCardHeader>
            <h5>Personal Information</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSavePersonalInfo}>
              <CFormInput
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <CFormInput
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <CFormInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <CFormInput
                label="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                type="tel"
                required
              />
              <CButton type="submit" color="primary" className="mt-2">
                Save Changes
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="4">
        <CCard>
          <CCardHeader>
            <h5>Change Password</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleChangePassword}>
              <CFormInput
                label="Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              <CFormInput
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                required
              />
              <CFormInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                required
              />
              <CButton type="submit" color="danger" className="mt-2">
                Change Password
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserProfile;
