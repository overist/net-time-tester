import { logout } from "@/apis/auth";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: res } = await logout();
        toast.success(res.message);
        router.push("/auth/login");
      } catch (err) {
        toast.error("로그아웃에 실패했습니다.");
      }
    };
    init();
  }, []);

  return <></>;
};

export default Logout;
