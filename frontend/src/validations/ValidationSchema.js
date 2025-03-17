import * as yup from "yup";

export const LoginFormSchema = yup.object({
  email: yup
    .string()
    .required("Email address is required..!")
    .email("Please enter a valid email address"),
  password: yup.string().required("Password is required...!"),
  remembarMe: yup.boolean(),
});

export const signupFormSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
  terms_of_service: yup
    .boolean()
    .oneOf([true], "You must accept the terms of service and privacy policy"),
});

export const TokenFormSchema = yup.object({
  token: yup.string().required("Token is required...!"),
});

export const RequestVerificationTokenSchema = yup.object({
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
});

export const ResetPasswordSchema = yup.object({
  token: yup.string().required("Token is required...!"),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
});

export const ProfilePictureSchema = yup.object({
  profile_image: yup
    .mixed()
    .required("Please select an image")
    .test(
      "fileFormat",
      "Invalid file format. Please select a JPEG, JPG, PNG, WEBP, SVG or GIF image.",
      (value) => {
        if (value) {
          const supportedFormats = [
            "image/png",
            "image/gif",
            "image/jpeg",
            "image/svg+xml",
            "image/webp",
            "image/jpg",
          ];
          return supportedFormats.includes(value.type);
        }
        return true;
      }
    )
    .test(
      "fileSize",
      "File size exceeds the maximum limit of 2MB.",
      (value) => {
        if (value) {
          const maxFileSizeInBytes = 2 * 1024 * 1024; // 2MB
          return value.size <= maxFileSizeInBytes;
        }
        return true;
      }
    ),
});

export const ChangePasswordSchema = yup.object({
  current_password: yup.string().required("Current password is required!"),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords mismatched."),
});

export const PersonalInfoSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup.string().required("Phone number is required"),
  area_expertise_id: yup
    .array()
    .of(yup.number())
    .required("Please select at least one area of practice.")
    .min(1, "Please select at least one area of practice."),
  jurisdiction_id: yup
    .array()
    .of(yup.number())
    .required("Please specify the jurisdiction.")
    .min(1, "Please select at least one jurisdiction."),
  // short_bio: yup
  //   .string()
  //   .required("short bio is required")
  //   .max(500, "Max characters' length exceed"),
  bar_membership_number: yup
    .string()
    .required("Bar association membership number is required."),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-over-18", "Must be at least 18 years old", function (value) {
      try {
        const currentDate = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

        const inputDate = new Date(value);

        return inputDate < eighteenYearsAgo;
      } catch (error) {
        console.error("Error in date validation:", error);
        return false; // or handle the error in an appropriate way
      }
    }),
  country_id: yup.string().required("Please select a country."),
  state_id: yup.string().required("Please select a state."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required"),
  address: yup.string().required("Office address is required."),
});

export const PersonalInfoSchemaForClient = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup
    .string()
    .matches(/^[\d\s-]+$/, "Invalid phone number format"),

  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-over-18", "Must be at least 18 years old", function (value) {
      try {
        const currentDate = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

        const inputDate = new Date(value);

        return inputDate < eighteenYearsAgo;
      } catch (error) {
        console.error("Error in date validation:", error);
        return false; // or handle the error in an appropriate way
      }
    }),
});

export const AddressInfoSchema = yup.object({
  country_id: yup.string().required("Please select a country."),
  state_id: yup.string().required("Please select a state."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required"),
  address: yup.string().required("Office address is required."),
});

export const subscribeSchema = yup.object({
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
});

export const AddUserSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
     
});

export const AddLawyerSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup
    .string()
    .required("Phone Number is Required")
    .matches(/^[\d\s-]+$/, "Invalid phone number format"),
  area_expertise_id: yup
    .array()
    .of(yup.number())
    .required("Please select at least one area of practice.")
    .min(1, "Please select at least one area of practice."),
  jurisdiction_id: yup
    .array()
    .of(yup.number())
    .required("Please specify the jurisdiction.")
    .min(1, "Please select at least one jurisdiction."),
  // short_bio: yup
  //   .string()
  //   .required("short bio is required")
  //   .max(500, "Max characters' length exceed"),
  bar_membership_number: yup
    .string()
    .required("Bar association membership number is required.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Please input a valid Bar association membership number"
    ),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-over-18", "Must be at least 18 years old", function (value) {
      try {
        const currentDate = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

        const inputDate = new Date(value);

        return inputDate < eighteenYearsAgo;
      } catch (error) {
        console.error("Error in date validation:", error);
        return false; // or handle the error in an appropriate way
      }
    }),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
  status: yup.string().required("Status is required."),
  country_id: yup.string().required("Country is required."),
  state_id: yup.string().required("State is required."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required."),
  address: yup.string().required("Address is required."),
});

export const UpdateLawyerSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup
    .string()
    .required("Phone Number is Required")
    .matches(/^[\d\s-]+$/, "Invalid phone number format"),
  area_expertise_id: yup
    .array()
    .of(yup.number())
    .required("Please select at least one area of practice.")
    .min(1, "Please select at least one area of practice."),
  jurisdiction_id: yup
    .array()
    .of(yup.number())
    .required("Please specify the jurisdiction.")
    .min(1, "Please select at least one jurisdiction."),
  // short_bio: yup
  //   .string()
  //   .required("short bio is required")
  //   .max(500, "Max characters' length exceed"),
  bar_membership_number: yup
    .string()
    .required("Bar association membership number is required.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Please input a valid Bar association membership number"
    ),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-over-18", "Must be at least 18 years old", function (value) {
      try {
        const currentDate = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

        const inputDate = new Date(value);

        return inputDate < eighteenYearsAgo;
      } catch (error) {
        console.error("Error in date validation:", error);
        return false; // or handle the error in an appropriate way
      }
    }),
  status: yup.string().required("Status is required."),
  country_id: yup.string().required("Country is required."),
  state_id: yup.string().required("State is required."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required."),
  address: yup.string().required("Address is required."),
});

export const AddClientSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup
    .string()
    .required("Phone Number is Required")
    .matches(/^[\d\s-]+$/, "Invalid phone number format"),

  password: yup
    .string()
    .min(8, "Password must be 8 characters long.")
    .matches(/[0-9]/, "Password must contain a number.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[^\w]/, "Password must contain a special character.")
    .required("Password is required!"),
  password_confirmation: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords must match."),
  status: yup.string().required("Status is required."),
  country_id: yup.string().required("Country is required."),
  state_id: yup.string().required("State is required."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required."),
  address: yup.string().required("Address is required."),
});

export const UpdateClientSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
  phone_number: yup
    .string()
    .required("Phone Number is Required")
    .matches(/^[\d\s-]+$/, "Invalid phone number format"),
  status: yup.string().required("Status is required."),
  country_id: yup.string().required("Country is required."),
  state_id: yup.string().required("State is required."),
  city: yup.string().required("City is required."),
  zip_code: yup.number().required("Zip code is required."),
  address: yup.string().required("Address is required."),
});

export const EditUserSchema = yup.object({
  first_name: yup
    .string()
    .required("First name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabetic characters."
    )
    .min(2, "First name must be at least 2 characters long."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Last name must contain only alphabetic characters."
    )
    .min(2, "Last name must be at least 2 characters long."),
  email: yup
    .string()
    .required("Email address is required!")
    .email("Please enter a valid email address."),
});

export const AppointmentSchema = yup.object({
  title: yup.string().required("Subject is required."),
  lawyer_id: yup.string().required("Lawyer is required."),
  description: yup.string().required("Description is required!"),
  appointment_date: yup
    .string()
    .required("Appointment date is required!")
    .test(
      "is-future-date",
      "Appointment date should be later than today",
      function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of today
        const selectedDate = new Date(value);

        return selectedDate > today;
      }
    ),
  appointment_start_time: yup
    .string()
    .required("Appointment start time is required!"),
  // meeting_type: yup.string().required("meeting type is required!"),
});
export const ContractCreationSchema = yup.object().shape({
  contract_type: yup.string().required("Please Select Contract Type"),
  contract_title: yup
    .string()
    .required("Please Enter Contract Title")
    .test(
      "min",
      "Contract Title must be at least 5 characters",
      (value) => value.length >= 5
    )
    .test(
      "max",
      "Contract Title can be at most 100 characters",
      (value) => value.length <= 100
    ),
  client: yup
    .string()
    .required(
      "Please select a Client from the list or enter the Client's name."
    ),
  start_date: yup.string().required("Start Date is required"),
  fees_amount: yup
    .number()
    .min(0, "Fees amount must be 0 or a positive number")
    .required("Fees amount is required"),
});
export const WebSettingSchema = yup.object().shape({
  site_name: yup.string().required("Please enter website name"),
  site_email: yup.string().required("Please enter website email"),
  // site_logo: yup.string().required("Please Select Contract Type"),
  // site_favicon: yup.string().required("Please Select Contract Type"),
  site_contact: yup
    .number()
    .typeError("Must be a number")
    .required("Please enter website contact"),
  admin_commission_percent: yup
    .number()
    .typeError("Must be a number")
    .required("Please enter comission percent"),
  gpt_key: yup.string().required("Please enter gpt key"),
  stripe_public_key: yup.string().required("Please enter stripe pk"),
  stripe_secret_key: yup.string().required("Please enter stripe sk"),
  encryption_key: yup.string().required("Please enter encryption key"),
});

export const ContactUsSchema = yup.object().shape({
  username: yup
    .string()
    .required("Please enter username")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username can't exceed 50 characters"),
  email: yup
    .string()
    .required("Please enter email")
    .email("Please enter a valid email address"),
  subject: yup.string().required("Please enter subject"),
  message: yup.string().required("Please enter message"),
});

export const responseOfMessageForAdminSchema = yup.object({
  subject: yup.string().required("Please enter subject"),
  message: yup.string().required("Please enter message"),
});

export const CreatemilestoneStageschema = yup.object({
  contract_id: yup.string().required("Please select contract"),
  name: yup.string().required("Please Enter name."),
  description: yup.string().required("Please Enter description."),
});
export const CreatemilestoneStepschema = yup.object({
  stage_id: yup.string().required("Please select stage"),
  name: yup.string().required("Please Enter name."),
  description: yup.string().required("Please Enter description."),
});
export const addImageSchema = yup.object().shape({
  alt_text: yup.string().required("Please enter text"),
  order: yup.string().required("Please enter order"),
});
export const updateImageSchema = yup.object().shape({
  text: yup.string().required("Please enter text"),
  punchline: yup.string().required("Please enter punchline"),
});
