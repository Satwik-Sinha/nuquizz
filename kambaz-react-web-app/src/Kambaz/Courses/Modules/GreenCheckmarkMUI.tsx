import { CheckCircle } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";

export default function GreenCheckmarkMUI(props: SvgIconProps) {
  return (
    <CheckCircle
      {...props}
      sx={{
        color: "success.main",
        fontSize: "1.2rem",
        ...props.sx,
      }}
    />
  );
}
