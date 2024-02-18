import CommonLayout from "@/components/layout/CommonLayout";
import { muiTheme } from "@/mui-theme";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <RecoilRoot>
          <CommonLayout>
            <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
            <Component {...pageProps} />
          </CommonLayout>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}
