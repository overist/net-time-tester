import { loginKakao } from "@/apis/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";

const Kakao: NextPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;

  const handleCallback = useCallback(
    async (code: string | string[]) => {
      const params = {
        code: code,
      };
      const { data: res } = await loginKakao(params);
      console.log(res);

      if (res.statusCode === 200) {
        toast(res.message);
        router.push("/");
      } else if (res.statusCode === 308) {
        toast(res.message);
        router.push("/auth/join");
      } else {
        toast.error(res.message);
        router.push("/auth/login");
      }
    },
    [router]
  );

  useEffect(() => {
    if (authCode) {
      handleCallback(authCode);
    } else if (kakaoServerError) {
      router.push("/auth/login");
      toast.error("카카오 로그인에 실패했습니다.");
    }
  }, [handleCallback, authCode, kakaoServerError, router]);

  return <h2>로그인 중입니다..</h2>;
};

export default Kakao;
