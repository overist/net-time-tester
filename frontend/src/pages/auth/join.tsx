import { userAtom } from "@/store/atoms";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CustomDropzone from "@/components/CustomDropzone";
import { getUser, signUp } from "@/apis/auth";

const Join = () => {
  const router = useRouter();
  const user = useRecoilValue(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);

  console.log(user);

  // ** States
  const [form, setForm] = useState({
    account: "",
    username: "",
    intro: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // ** Handler
  const handleChangeForm = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const handleImageChange = (file) => {
    setSelectedImage(file);
  };
  const handleSubmit = async () => {
    // 유효성체크
    if (form.account.length < 5 || form.account.length > 20) {
      toast.error("아이디는 5자 이상 20자 이하로 입력해주세요.");
      return;
    }

    if (form.username.length < 2 || form.username.length > 20) {
      toast.error("닉네임은 2자 이상 20자 이하로 입력해주세요.");
      return;
    }

    if (form.intro.length > 50) {
      toast.error("자기소개는 50자 이하로 입력해주세요.");
      return;
    }

    if (!selectedImage) {
      toast.error("프로필 이미지를 등록해주세요.");
      return;
    }

    // 회원가입 시도
    try {
      // 폼 데이터 작성
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("account", form.account);
      formData.append("intro", form.intro);
      formData.append("username", form.username);

      const { data: res } = await signUp(formData);
      if (res.statusCode === 200) {
        toast(res.message);

        const { data: res2 } = await getUser();
        console.log("회원가입후 => ", res2);
        if (res2.statusCode === 200 && res2.data) {
          setUserAtom(res2.data);
          router.push("/");
        } else {
          throw new Error(res2.message);
        }
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      // 이미 로그인 되어있는 경우
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Box p={4}>
        <Typography variant="h4">회원가입</Typography>
        <Typography variant="body1">
          회원 가입을 위한 추가 정보를 입력해주세요.
        </Typography>

        {/* ID, Intro, Profile Image */}
        <Box>
          <Box>
            <>
              <Box sx={{ mt: 2 }}>
                <TextField
                  type="text"
                  id="outlined-basic"
                  label={"URL 주소에 매핑되는 아이디"}
                  variant="outlined"
                  fullWidth
                  value={form.account}
                  onChange={(e) => handleChangeForm("account", e.target.value)}
                />

                <Typography variant="body2" align="right" mt={0.5}>
                  (필수) 5자 이상 20자 이하의 영문, 숫자, -, _만 사용
                  가능합니다.
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  type="text"
                  id="outlined-basic"
                  label={"닉네임"}
                  variant="outlined"
                  fullWidth
                  value={form.username}
                  onChange={(e) => handleChangeForm("username", e.target.value)}
                />
              </Box>

              <Typography variant="body2" align="right" mt={0.5}>
                (필수) 2자 이상 20자 이하의 닉네임을 입력해주세요.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  type="text"
                  id="outlined-basic"
                  label={"자기소개"}
                  variant="outlined"
                  fullWidth
                  value={form.intro}
                  onChange={(e) => handleChangeForm("intro", e.target.value)}
                />
                <Typography variant="body2" align="right" mt={0.5}>
                  (선택) 50자 이하의 자기소개를 입력해주세요.
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">프로필 이미지 등록</Typography>

                <CustomDropzone onImageChange={handleImageChange} />
              </Box>
            </>

            <Typography variant="body2" align="right" mt={0.5}>
              (필수) 2MB 이하의 이미지 파일을 등록해주세요.
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              회원가입
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Join;
