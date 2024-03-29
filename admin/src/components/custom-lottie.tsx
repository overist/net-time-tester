import Lottie from 'react-lottie'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import * as cat from 'src/pages/components/lottie/cat.json'

const CustomLottie = (props: any) => {
  return (
    <>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: cat,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }}
        isClickToPauseDisabled
        height={props.height}
        width={props.width}
      />
      <Stack textAlign={'center'}>
        <Typography>{props.text}</Typography>
      </Stack>
    </>
  )
}

export default CustomLottie
