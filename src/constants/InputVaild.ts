export const InputVaild = {
  required: (message: string) => [{ required: true, message }],
  
  username: [
    { required: true, message: "Please input username!" },
    { max: 20, message: "Username cannot exceed 20 characters!" },
  ],

  email: [
    { required: true, message: "Please input email!" },
    
    { 
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Email must contain valid special characters (@, ., etc)!"
    },
  ],

  oldPassword: [
    { required: true, message: "Please input your old password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
  ],
  
  password:[
    { required: true, message: "Please input password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
    {
    pattern: /^(?=.*[A-Z])[A-Z](?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/,
    message: "Password must contain at least one uppercase letter, one number & one special character!",
    }
  ],

  newPassword: (getFieldValue: any) => [
    { required: true, message: "Please input password!" },
    { min: 6, message: "Password must be at least 6 characters!" },
    {
      pattern: /^(?=.*[A-Z])[A-Z](?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/,
      message: "Password must contain at least one uppercase letter, one number & one special character!",
    },
    {
      validator: (_: any, value: string) => {
        const oldPassword = getFieldValue('old_password');
        if (oldPassword && value === oldPassword) {
          return Promise.reject(new Error('New password cannot be the same as old password!'));
        }
        return Promise.resolve();
      }
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

  confirmNewPassword: (getFieldValue: any) => [
    { required: true, message: "Please confirm your password!" },
    {
      validator(_: any, value: string) {
        if (!value || getFieldValue("new_password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("The passwords do not match!"));
      },
    },
  ],

  projectCode: [
    { required: true, message: "Please input project code!" },
    { max: 20, message: "Project code cannot exceed 20 characters!" },
  ],
  
};
