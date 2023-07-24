import React from "react";

const Register = () => {
  const [fields, setFields] = useState([
    { label: "FullName", value: "", error: "" },
    { label: "email", value: "", error: "" },
    { label: "password", value: "", error: "" },
    { label: "Username", value: "", error: "" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [isUsernameExists, setIsUsernameExists] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");

  // Ref for input fields
  const inputRefs = useRef([]);

  // useEffect(() => {
  //   const text = "Welcome to Degen Money";
  //   let index = 0;
  //   let timer;

  //   const animateText = () => {
  //     if (index < text.length - 1) {
  //       setWelcomeText((prevText) => prevText + text[index]);
  //       index++;
  //     } else {
  //       clearInterval(timer);
  //     }
  //   };

  //   timer = setInterval(animateText, 100);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    if (currentStep < inputRefs.current.length) {
      inputRefs.current[currentStep].focus();
    }
  }, [currentStep]);

  const handleInputChange = (e, index) => {
    const updatedFields = [...fields];
    updatedFields[index].value = e.target.value;
    setFields(updatedFields);

    if (e.key === "Enter") {
      handleContinue(e);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const updatedFields = [...fields];

    if (updatedFields[currentStep].value.trim() === "") {
      updatedFields[currentStep].error = "Please enter a value.";
      isValid = false;
    } else {
      updatedFields[currentStep].error = "";
    }

    if (currentStep === 1 && !isValidEmail(updatedFields[currentStep].value)) {
      updatedFields[currentStep].error = "Please enter a valid email address.";
      isValid = false;
    }

    setFields(updatedFields);
    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentStep === fields.length - 1) {
        const { FullName, email, password, Username } = fields.reduce(
          (values, field) => {
            values[field.label] = field.value;
            return values;
          },
          {}
        );

        // Check email and username existence before submitting
        fetch("http://localhost:8000/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, Username }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.emailExists) {
              setIsEmailExists(true);
              setTimeout(() => setIsEmailExists(false), 2000); // Clear email error after 2 seconds
            } else if (res.usernameExists) {
              setIsUsernameExists(true);
              setTimeout(() => setIsUsernameExists(false), 2000); // Clear username error after 2 seconds
            } else {
              fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ FullName, email, password, Username }),
              })
                .then((res) => res.json())
                .then((res) => {
                  console.log(res, "userRegister");
                  setIsRegistrationSuccessful(true);
                })
                .catch((error) => {
                  console.error("Registration failed:", error);
                  setIsRegistrationSuccessful(false);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking email and username:", error);
          });
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    }
  };

  return <div>Register</div>;
};

export default Register;
