import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#329D9C",
      contrastText: "#ffffff",
      dark: "#329D9C",
    },
    secondary: {
      main: "#999999",
      contrastText: "#ffffff",
      dark: "#999999",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {},
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {},
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {},
        select: {
          "&:focus": {
            backgroundColor: "transparent", // 선택된 항목 배경색을 투명으로 설정
          },
          "&:hover": {
            backgroundColor: "transparent", // 마우스 호버시 배경색을 투명으로 설정
          },
          "&.Mui-focused": {
            backgroundColor: "transparent", // 포커스 시 배경색을 투명으로 설정
          },
          "& .MuiSelect-select": {},
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {},
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          height: "45px",

          "&.Mui-disabled": {},
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {},
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            input: {
              "-webkit-text-fill-color": "#222 !important", // Set text color to white for disabled state
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {},
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            // Correct selector for disabled state
            color: "#222", // Set color to white for disabled state
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#222",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {},
      },
    },
  },
  typography: {
    fontFamily: "Pretendard, sans-serif",
    body1: {
      fontFamily: "Pretendard, sans-serif",
    },
    body2: {
      fontFamily: "Pretendard, sans-serif",
    },
    button: {
      fontFamily: "Pretendard, sans-serif",
    },
    caption: {
      fontFamily: "Pretendard, sans-serif",
    },
    h1: {
      fontFamily: "Pretendard, sans-serif",
    },
    h2: {
      fontFamily: "Pretendard, sans-serif",
    },
    h3: {
      fontFamily: "Pretendard, sans-serif",
    },
    h4: {
      fontFamily: "Pretendard, sans-serif",
    },
    h5: {
      fontFamily: "Pretendard, sans-serif",
    },
    h6: {
      fontFamily: "Pretendard, sans-serif",
    },
    subtitle1: {
      fontFamily: "Pretendard, sans-serif",
    },
    subtitle2: {
      fontFamily: "Pretendard, sans-serif",
    },
  },
});
