import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import avatar8 from "./../../assets/images/avatars/8.jpg";
import { cilBell, cilLockLocked, cilTrash } from "@coreui/icons";

const AppHeaderDropdown = () => {
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState(avatar8);
  const navigate = useNavigate();
  const {
    createDoctorProfile,
    removeDoctorProfile,
    fetchDoctorProfilePicture,
  } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctorProfilePicture().then((data) => setAvatar(data));
  }, [fetchDoctorProfilePicture]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const profileData = new FormData();
    profileData.append("profile", file);

    try {
      const data = await createDoctorProfile(profileData);
      setAvatar(data.profileUrl); // Update avatar with the uploaded image
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error uploading profile:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeDoctorProfile();
      setAvatar(avatar8); // Reset to default avatar
      console.log("Profile picture removed");
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  const handleLogout = () => {
    console.log("Logout action triggered");
    window.location.href = "/";
    localStorage.removeItem("token");
  };
  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>
        <CDropdownItem onClick={handleProfileClick}>My Profile</CDropdownItem>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm onSubmit={handleUpload}>
          <CFormInput type="file" onChange={handleFileChange} />
          <CButton type="submit" color="primary" className="mt-2">
            Upload Profile Picture
          </CButton>
        </CForm>
        <CButton color="danger" className="mt-2" onClick={handleRemove}>
          <CIcon icon={cilTrash} className="me-2" />
          Remove Profile Picture
        </CButton>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="/" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
