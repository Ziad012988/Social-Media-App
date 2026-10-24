import * as zod from "zod";

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be at most 20 characters"),

    email: zod
      .email()
      .nonempty("Email is required")
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ),

    dateOfBirth: zod
      .string()
      .nonempty("Date is requred")
      .refine((value) => {
        const today = new Date().getFullYear();
        const userDate = new Date(value).getFullYear();
        return today - userDate >= 18 || false;
      }, "You must be at least 18 years old"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character",
      ),
    rePassword: zod.string().nonempty("repassword is required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    {
      path: ["rePassword"],
      error: "password & repassword no match!",
    },
  );

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

////////////////////////////////////////////////////////////////////////////////////////////////
export const LoginSchema = zod.object({
  email: zod
    .email()
    .nonempty("Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),

  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character",
    ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
