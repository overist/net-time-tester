import { Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { getSysInfo, getUser } from "@/apis/auth";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sysInfoAtom, userAtom } from "@/store/atoms";
import toast from "react-hot-toast";

const CommonLayout = ({ children }) => {
  // ** Hooks
  const user = useRecoilValue(userAtom);
  const sysInfo = useRecoilValue(sysInfoAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const setSysInfoAtom = useSetRecoilState(sysInfoAtom);
  const router = useRouter();

  // ** States
  const [loading, setLoading] = useState(false);

  // ** init data
  const initData = async () => {
    try {
      // 시스템 정보 갱신
      const { data: res2 } = await getSysInfo();
      if (res2.statusCode === 200) {
        if (res2.data === null) {
          setSysInfoAtom(res2.data);
        }
      }

      // 유저 정보 갱신
      const { data: res } = await getUser();
      if (res.statusCode === 200) {
        // 로그인이 안 되어 있는 경우
        if (res.data !== null) {
          setUserAtom(res.data);
        } else {
          setUserAtom(null);
        }
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

export default CommonLayout;
