import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture } from "../../redux/actions/userActions";
import { Form } from "react-bootstrap";
import EditButton from "../layout/EditButton";
import { ProfilePictureSchema } from "../../validations/ValidationSchema";
import { Avatar, Button } from "@mantine/core";

const UpdateProfilePicture = ({
  handleEditState,
  editState,
  handleCancel,
  userRole,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileField = useRef(null);

  const { userData } = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleImagePreviewer = (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);

    setSelectedImage(e.target.files[0]);

    values.profile_image = e.target.files[0];
  };

  const { handleBlur, handleSubmit, values, errors, touched } = useFormik({
    initialValues: { profile_image: "" },
    validationSchema: ProfilePictureSchema,
    onSubmit: async (values) => {
      const res = await dispatch(
        updateProfilePicture(userRole, values.profile_image)
      );
      if (res === "success") {
        handleEditState(0);
      }
    },
  });

  const handleCancelImageUpload = () => {
    setSelectedImage(userData.image);
    handleCancel();
  };

  return (
    <Form
      encType="multipart/form-data"
      className="row white-rounded-container position-relative"
      onSubmit={handleSubmit}
    >
      <div className="col-12 d-flex flex-wrap gap-4 justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-start gap-3 mt-sm-0 mt-3">
          <label>
            <div
              className={`rounded-circle profile-image ${
                editState === 1 ? "camera-icon-before cursor-pointer" : ""
              }`}
            >
              <Avatar
                size={"100%"}
                radius={500}
                src={selectedImage !== null ? selectedImage : userData.image}
                alt="user"
                className="rounded-circle"
              />

              {editState === 1 && (
                <input
                  ref={fileField}
                  type="file"
                  onChange={handleImagePreviewer}
                  onBlur={handleBlur}
                  id="profileImage"
                  name="profileImage"
                  className="d-none"
                />
              )}
            </div>

            {editState === 1 && (
              <span className="d-block mt-2 cursor-pointer">
                Upload picture
              </span>
            )}
          </label>
          <span className="d-flex flex-column">
            <h2 className="text-capitalize mt-5">{`${userData.first_name} ${userData.last_name}`}</h2>
            {/* // * if you ever need to add bio or something similar uncomment this */}
            {/* {userRole === "Lawyer" ? (
              <>
                <span className="degree-heading"></span>
                <span className="degree"></span>
              </>
            ) : null} */}
          </span>
        </div>
      </div>
      {errors.profile_image && touched.profile_image ? (
        <span className="d-block validation-error-message mt-1">
          {errors.profile_image}
        </span>
      ) : null}
      {editState !== 1 && (
        <div className="position-absolute me-md-4 mt-md-3 end-0 w-auto">
          <EditButton onClick={() => handleEditState(1)} />
        </div>
      )}
      {editState === 1 && (
        <div className="d-flex justify-content-sm-end justify-content-center gap-3 mt-2">
          <button
            type="button"
            className="btn btn-outline-danger rounded-pill px-4 mt-2"
            onClick={handleCancelImageUpload}
          >
            Cancel
          </button>
          <Button
            loading={loading}
            loaderProps={{ color: "#198754" }}
            type="submit"
            className="btn btn-outline-success rounded-pill px-4 mt-2"
          >
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
};

export default UpdateProfilePicture;
