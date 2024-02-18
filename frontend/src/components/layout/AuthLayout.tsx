import { Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { getSysInfo, getUser } from "@/apis/auth";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sysInfoAtom, userAtom } from "@/store/atoms";
import toast from "react-hot-toast";

const AuthLayout = ({ children, auth }) => {
  // ** Recoil State
  const user = useRecoilValue(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const setSysInfoAtom = useSetRecoilState(sysInfoAtom);
  const router = useRouter();

  // ** States
  const [loading, setLoading] = useState(false);

  // ** init data
  const initData = async () => {
    try {
      // 유저 스테이트로부터 로그인체크 (로그인 체크는 _app 인덱스에서 확인)

      // TODO : AuthLayout 또는 유틸 별도 분리
      // 로그인 페이지로 강제이동
      if (router.pathname !== "/auth/join") {
        // 회원가입은 예외
        router.push("/auth/login");
      }
    } catch (err) {
      toast.error("서버에서 정보를 불러오는데 실패했습니다.");
    }

    // 로딩 종료 TODO: SWR로 변경
    setLoading(true);
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <Container
        sx={{
          background: "#ddd",
          minHeight: "100vh",
          // 600px, sm 사이즈 이상일 때만 margin left 10으로 설정
          marginLeft: { sm: "250px" },
          paddingTop: "64px",
        }}
        maxWidth="sm"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {!loading && <h2>로딩중입니다...</h2>}
        {loading && children}
      </Container>
    </>
  );
};

export default AuthLayout;
