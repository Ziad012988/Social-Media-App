import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  userLogin: string | null;
  setUserLogin: Dispatch<SetStateAction<string | null>>;
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setUserLogin: () => {},
  userId: "",
  setUserId: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userLogin, setUserLogin] = useState<string | null>(() =>
    localStorage.getItem("userToken"),
  );
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (!userLogin) {
      setUserId("");
      return;
    }

    try {
      const decoded = jwtDecode<{ user: string }>(userLogin);
      setUserId(decoded.user);
    } catch {
      // توكن غير صالح
      setUserId("");
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider
      value={{ userLogin, setUserLogin, userId, setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
}