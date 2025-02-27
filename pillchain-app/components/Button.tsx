import { TouchableOpacity } from "react-native";

interface ButtonProps {
  color: string;
  children: React.ReactNode;
}

export function Button({
  color,
  children,
  style,
  ...rest
}: ButtonProps & React.ComponentProps<typeof TouchableOpacity>) {
  return (
    <TouchableOpacity
      {...rest}
      style={[
        {
          backgroundColor: color,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 'auto'
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}
