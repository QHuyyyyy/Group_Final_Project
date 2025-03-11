export const InputVaild = {
  required: (message: string) => [{ required: true, message }],

  email: [
    { required: true, message: "Please input email!" },
    { type: "email", message: "Please enter a valid email!" },
  ],

  password: [
    { required: true, message: "Please input password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
    {
      pattern:  /^(?=.*[A-Z])[A-Z](?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/,
      message: "Password must contain at least one uppercase letter, one number & one special character!",
    },
  ],

  confirmPassword: (getFieldValue: any) => [
    { required: true, message: "Please confirm your password!" },
    {
      validator(_: any, value: string) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("The passwords do not match!"));
      },
    },
  ],
};
