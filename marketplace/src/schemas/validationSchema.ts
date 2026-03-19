import * as yup from "yup";
//Sign Up form validation schema
export const signUpSchema = yup.object().shape({
    username: yup.string().required("El nombre de usuario es obligatorio"),
    email: yup.string().required("El correo es obligatorio").email("Formato de correo inválido"),
    password: yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: yup.string()
        .required("Confirma tu contraseña")
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
    remember: yup.boolean(),
});
//Sign in form validation schema
export const signInSchema = yup.object().shape({
    userNameOrEmail: yup.string().required("El correo o usuario es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
});

//Forgot form validation schema
export const forgotSchema = yup.object().shape({
    email: yup.string().required("El correo o usuario es obligatorio")
});


//Blog comment form validation schema
export const blogCommentSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    number: yup.string().required("Phone number is required").matches(/^\d+$/, "Phone number must be numeric"),
    message: yup.string().required("Message is required"),
});

//Contact form validation schema
export const contactSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    number: yup.string().required("Phone number is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
});

//Contact form validation schema
export const contactTwoSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    phone: yup.string().required("Phone number is required"),
    caseDetails: yup.string().required("Message is required"),
  });

//Property Review validation schema (Comparte tu opinión / reseña)
export const propertyReviewSchema = yup.object().shape({
    name: yup.string().required("El nombre completo es requerido"),
    email: yup.string().required("El email es requerido").email("Correo electrónico inválido"),
    number: yup.string().required("El número de teléfono es requerido"),
    message: yup.string().required("El mensaje es requerido"),
    termsAccepted: yup.boolean().oneOf([true], "Debes aceptar los términos de uso"),
});

//leave message validation schema
export const leaveMessageSchema = yup.object().shape({
    name: yup.string().required("El nombre completo es requerido"),
    phone: yup.string().required("El número de teléfono es requerido"),
    email: yup
      .string()
      .required("El correo electrónico es requerido")
      .email("Correo electrónico inválido"),
    message: yup.string().required("El mensaje es requerido"),
  });