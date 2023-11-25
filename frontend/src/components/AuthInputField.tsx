import { Typography, TextField } from "@mui/material";

interface AuthInput {
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const AuthInputField = (props: AuthInput) => {
  const { type, placeholder, onChange } = props;
  return (
    <>
      <Typography
        paddingInlineStart={"10px"}
        marginTop={"20px"}
        marginBottom={"10px"}
      >
        {placeholder}:
      </Typography>
      <TextField
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        required
      ></TextField>
    </>
  );
};

export default AuthInputField;
